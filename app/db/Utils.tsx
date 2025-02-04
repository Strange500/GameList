"use server";

import { revalidatePath } from "next/cache";
import { Games } from "./models/Games";


export const changeId = async (formData: FormData) =>  {
    "use server";
    await Games.changeGameId(formData.get('path') as string, parseInt(formData.get('id') as string));
    revalidatePath('/');
}