"use server"

import * as z from "zod"
import { LogInSchema } from '../schemas/index';

export const login = async (values: z.infer<typeof LogInSchema>) => {
    const validatedFields = LogInSchema.safeParse(values);

    if (!validatedFields) {
        return { error: "Invalid fields!"}
    }

    return {success: "Email sent!"}
}