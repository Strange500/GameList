import { getAllGames, getGame } from "@/app/db/gameDB";
import { GameDetails } from "@/app/db/gameDetail";
import JSZip from "jszip";
import fs from "fs";
import archiver from 'archiver';
import path, { join } from "path";
import { NextResponse } from "next/server";
import { Readable, Stream } from "stream";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Parse ID from params
  let id: number;
  try {
      id = parseInt(params.id, 10);
      if (isNaN(id)) throw new Error('Invalid ID');
  } catch {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
          headers: {
              'Content-Type': 'application/json',
          },
          status: 400,
      });
  }

  // Get game folder path from environment variables
  const gameFolderPath = process.env.GAME_FOLDER_PATH;
  if (!gameFolderPath) {
      return new Response(JSON.stringify({ error: 'GAME_FOLDER_PATH environment variable not set' }), {
          headers: {
              'Content-Type': 'application/json',
          },
          status: 500,
      });
  }

  // Retrieve game details
  const game: GameDetails | undefined = await getGame(id);
  if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
          headers: {
              'Content-Type': 'application/json',
          },
          status: 404,
      });
  }

  const gamePath = join(gameFolderPath, game.path);
  
  // Stream the zip file
  const archive = archiver('zip', {
      zlib: { level: 0 } // Set the compression level
  });

  // Create a stream to output the archive to response
  const stream = new Readable().wrap(archive);

  // Set response headers
  const headers = {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${id}.zip`,
  };

  // Error handling for archiver
  archive.on('error', (err: Error) => {
      console.error('Archive error: ', err);
      const response = new Response(JSON.stringify({ error: 'Failed to create zip' }), {
          headers: {
              'Content-Type': 'application/json',
          },
          status: 500,
      });
      stream.destroy(err); // Destroy the stream on error
      return response;
  });

  // Append directory to the archive
  archive.directory(gamePath, false);

  // Finalize the archive and handle completion
  archive.finalize()
      .then(() => {
          console.log('Archive has been finalized and is now ready for streaming.');
      })
      .catch((err: Error) => {
          console.error('Finalization error: ', err);
          stream.destroy(err);
      });

  // Return the response with the streaming archive
  return new Response(stream as unknown as BodyInit, { headers });
}



/**
 * Adds all files from the specified folder to the provided JSZip instance.
 * 
 * @param folderPath - The path to the folder to zip.
 * @param zip - The JSZip instance to which files will be added.
 * @param basePath - The base path to maintain folder structure in the zip.
 */
async function addFilesFromFolderToZip(folderPath: string, zip: JSZip, basePath: string = ''): Promise<void> {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
          // If it's a directory, recurse into it
          await addFilesFromFolderToZip(fullPath, zip, path.join(basePath, file));
      } else {
          // If it's a file, read it and add it to the zip
          const data = fs.readFileSync(fullPath);
          const relativePath = path.join(basePath, file);
          zip.file(relativePath, data);
      }
  }
}