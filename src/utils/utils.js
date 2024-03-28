import fs from 'fs';
import path from 'path';

/**
 * Creates a directory if it doesn't exist.
 * If the directory already exists, it logs a message.
 * @param {string} directoryName - The name of the directory to create.
 * @param {string} [basePath] - The base path where the directory will be created. Optional. Default is the current working directory.
 * @example
 * // Usage example:
 * createImageDir('images', '/path/to/your/directory');
 * // If basePath is not provided, it will default to the current working directory:
 * createImageDir('images');
 */
export function createImageDir(directoryName, basePath = process.cwd()) {
  const directoryPath = path.join(basePath, directoryName);

  // Check if the directory exists
  fs.access(directoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Directory doesn't exist, create it
      fs.mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
        } else {
          console.log('Directory created successfully.');
        }
      });
    } else {
      console.log('Directory already exists.');
    }
  });
}
