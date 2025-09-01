import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * @description Recursively reads a directory and builds a structured tree of its contents.
 * @param {string} directoryPath The path to the directory to start reading from.
 * @returns {Promise<object | undefined>} A Promise that resolves to a structured JSON object.
 */
export async function readStructure(directoryPath) {
  let node = undefined;
  try {
    const stats = await fs.stat(directoryPath);
    if (stats.isDirectory()) {
      const folderNode = {
        type: 'folder',
        children: {},
        content: '',
      };

      const dirents = await fs.readdir(directoryPath, { withFileTypes: true });

      for (const dirent of dirents) {
        const fullPath = path.join(directoryPath, dirent.name);
        const childNode = await readStructure(fullPath);
        if (childNode) {
          folderNode.children[dirent.name] = childNode;
        }
      }
      node = folderNode;
    } else {
      // It's a file
      const fileNode = {
        type: 'file',
        content: await fs.readFile(directoryPath, 'utf-8'),
        children: {},
      };
      node = fileNode;
    }
  } catch (err) {
    console.error(`Error processing ${directoryPath}:`, err);
  }

  return node;
}

export async function flush(pathSegments, content) {
  try {
    // Join the path segments into a single file path string.
    const fullPath = path.join(...pathSegments);

    // Extract the directory path from the full path.
    const directory = path.dirname(fullPath);

    // Recursively create the directory structure if it does not exist.
    // The { recursive: true } option prevents an error if the directory already exists.
    await fs.mkdir(directory, { recursive: true });

    // Write the content to the file.
    await fs.writeFile(fullPath, content, 'utf-8');
  } catch (error) {
    console.error(`Error flushing content to file:`, error);
  }
}
