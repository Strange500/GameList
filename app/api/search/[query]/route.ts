import { findGame } from "@/app/db/gameDB";
import { auth } from "@/auth";


export async function GET(_: Request, { params }: { params: Promise<{ query: string }> }) {
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

    const { query } = await params;
    const res = await findGame(query)
    return new Response(JSON.stringify(res), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    
}