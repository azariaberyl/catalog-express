import { fileTypeFromBuffer } from 'file-type';
import { google } from 'googleapis';
import { Readable } from 'stream';
import ResponseError from '../error/response-error.js';
import { imageWhitelist } from './global.js';

const credentials = JSON.parse(process.env.CREDENTIALS);

/**
 * Check if the required environment variables are present.
 * @param {string[]} variables - An array of required environment variable names.
 * @throws {Error} If any required environment variable is missing.
 */
export function checkEnvVariables(variables) {
  const missingVariables = variables.filter((variable) => !process.env[variable]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }
}

/**
 * Uploads a file to Google Drive and sets its permission to public.
 * @param {Buffer} buffer - The file content buffer to upload.
 * @param {string} name - The name of the file.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} The ID of the uploaded file.
 * @throws {Error} Throws an error if the upload fails.
 */
export async function uploadFileToDrive(buffer, name, mimeType) {
  try {
    // Get credentials and build service
    const auth = new google.auth.GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
      credentials,
    });
    const myStream = Readable.from(buffer);
    const service = google.drive({ version: 'v3', auth });
    const requestBody = {
      name: name,
      parents: ['1manBHIVJxUFvtUMZwpvl4Wy84nOrJkKD'], // Specify the parent folder ID
      fields: 'id',
    };
    const media = {
      mimeType: mimeType,
      body: myStream,
    };
    // Upload the file
    const file = await service.files.create({
      requestBody,
      media,
    });

    // Set the permission to public
    await service.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return file.data.id;
  } catch (err) {
    if (err instanceof Error) {
      throw new ResponseError(500, err.message);
    }
  }
}

/**
 * Handles file uploads from the request.
 * @param {import('express').Request} req - The HTTP request.
 * @returns {Promise<void>} A Promise that resolves when all file uploads are handled.
 * @throws {ResponseError} Throws an error if the file type is not allowed.
 */
export async function handleFileUploads(req) {
  if (req.files) {
    await Promise.all(
      req.files.map(async (file) => {
        file.name = `${file.originalname}`;
        const meta = await fileTypeFromBuffer(file.buffer);
        if (meta) {
          if (!imageWhitelist.includes(meta.mime)) {
            throw new ResponseError(400, 'File type not allowed');
          }
          const imgId = await uploadFileToDrive(file.buffer, file.name, file.mimetype);
          file.imagePath =
            file.name && file.name !== 'undefined'
              ? `${file.name}o.ohttps://lh3.googleusercontent.com/d/${imgId}`
              : null;
        }
      })
    );
  }
}

/**
 * Updates item paths based on uploaded files.
 * @param {import('express').Request} req - The HTTP request.
 */
export function updateItemPaths(req) {
  if (req.body.items) {
    req.body.items = JSON.parse(req.body.items);
    if (req.files.length > 0) {
      req.body.items = req.body.items.map((item, i) => {
        const theImg = req.files[i];
        return theImg ? { ...item, imagePath: theImg.imagePath } : item;
      });
    }
  }
}

/**
 * Deletes multiple files from Google Drive.
 * @param {string[]} fileIds - An array of file IDs to delete.
 * @returns {Promise<void>} A Promise that resolves when all files are successfully deleted.
 * @throws {Error} Throws an error if any deletion fails.
 */
export async function deleteFilesFromDrive(fileIds) {
  try {
    // Get credentials and build service
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({ version: 'v3', auth });

    // Delete each file
    await Promise.all(
      fileIds.map(async (fileId) => {
        return service.files.delete({
          fileId: fileId,
        });
      })
    );
  } catch (err) {
    throw new ResponseError(500, 'Failed to delete files from Google Drive');
  }
}
