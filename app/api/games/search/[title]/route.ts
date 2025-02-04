import { RAWGIOAPI } from "@/app/db/RawgApi";
import { auth } from "@/auth";


export async function GET(_: Request, { params }: { params: Promise<{ title: string }> }) {
  const session = await auth();
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 401,
        });
    }

    const title = (await params).title;

    const result = await RAWGIOAPI.findByTitleJson(title);


    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

}

