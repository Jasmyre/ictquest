import * as z from "zod"

export const LogInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})