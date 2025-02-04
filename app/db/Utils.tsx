"use server";
import fs from 'fs';
import stream from 'stream';
import { ReadableStream as WebReadableStream } from 'stream/web';


import { revalidatePath } from "next/cache";
import { Games } from "./models/Games";


export const changeId = async (formData: FormData) =>  {
    "use server";
    await Games.changeGameId(formData.get('path') as string, parseInt(formData.get('id') as string));
    revalidatePath('/');
}


export async function saveWebFile(savePath: string, url: string) {
    const writeStream = fs.createWriteStream(savePath);
    const readStream = await fetch(url);
    const nodeStream = stream.Readable.fromWeb(readStream.body as WebReadableStream<unknown>);
    stream.pipeline(nodeStream, writeStream, (err) => {
        if (err) {
            console.error('Pipeline failed:', err);
        } else {
        }
    });
}