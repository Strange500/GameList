import { getImagePath } from "@/app/db/gameDB";
import { auth } from "@/auth";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";


export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    // Parse ID from params
    const session = await auth();
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 401,
        });
    }

    const imageFolder = await getImagePath();

    let id: number;
    try {
        id = parseInt((await params).id, 10);
        if (isNaN(id)) throw new Error('Invalid ID');
        // check if game folder exists
        if (!existsSync(join(imageFolder, id.toString()))) {
            return new Response(JSON.stringify({ error: 'Game not found' }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 404,
            });
        }
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ error: 'Invalid ID' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 400,
        });
    }

   const background_image = join(imageFolder, id.toString(), 'background.jpg');

   // Stream the image
    if (!existsSync(background_image)) {
         return new Response(JSON.stringify({ error: 'Background not found' }), {
              headers: {
                'Content-Type': 'application/json',
              },
              status: 404,
         });
    }

    const imageBuffer = await readFile(background_image);
    return new Response(imageBuffer, {
        headers: {
            'Content-Type': 'image/jpeg',
        },
        status: 200,
    });

}