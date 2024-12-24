import { getGame } from "@/app/db/gameDB";
import { GameDetails } from "@/app/db/gameDetail";
import archiver from 'archiver';
import { join } from "path";

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


  // Set response headers
  const headers = {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${game.name}.zip`,
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
      return response;
  });

  // Append directory to the archive
  archive.directory(gamePath, false);

  // finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
  archive.finalize();

  // Return the response with the streaming archive
  return new Response(archive , { headers });
}