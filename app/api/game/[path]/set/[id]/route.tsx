import { changeGameId } from "@/app/db/gameDB";
import { auth } from "@/auth";


export async function GET(_: Request, { params }: { params: Promise<{ path: string, id : number }> }) {
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

    const { path, id } = await params;
    const decodedPath = decodeURIComponent(path);
    await changeGameId(decodedPath, id);
    return new Response("ok", {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    
}