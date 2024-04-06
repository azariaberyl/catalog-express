import { fileTypeFromBuffer } from 'file-type';
import { google } from 'googleapis';
import { Readable } from 'stream';
import ResponseError from '../error/response-error.js';
import { imageWhitelist } from './global.js';

const credentials = JSON.parse(process.env.CREDENTIALS);

/**
 * Uploads a file to Google Drive and sets its permission to public.
 * @param {Buffer} buffer - The file content buffer to upload.
 * @param {string} name - The name of the file.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} The ID of the uploaded file.
 * @throws {Error} Throws an error if the upload fails.
 */
export async function uploadFileToDrive(buffer, name, mimeType) {
  console.log(credentials);
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
      // parents: ['1manBHIVJxUFvtUMZwpvl4Wy84nOrJkKD'], // Specify the parent folder ID
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

export async function handleFileUploads(req) {
  if (req.files) {
    await Promise.all(
      req.files.map(async (file) => {
        if (file.originalname === 'undefined') return;
        file.name = `${req.body.username}/${file.originalname}`;
        const meta = await fileTypeFromBuffer(file.buffer);
        if (!imageWhitelist.includes(meta.mime)) {
          throw new ResponseError(400, 'File type not allowed');
        }
        const imgId = await uploadFileToDrive(file.buffer, file.name, file.mimetype);
        file.imagePath = `https://lh3.googleusercontent.com/d/${imgId}`;
      })
    );
  }
}

export function updateItemPaths(req) {
  if (req.body.items) {
    req.body.items = JSON.parse(req.body.items);
    if (req.files.length > 0) {
      req.body.items = req.body.items.map((item, i) => {
        const theImg = req.files.find((file, _i) => _i === i);
        return theImg ? { ...item, imagePath: theImg.imagePath } : item;
      });
    }
  }
}
