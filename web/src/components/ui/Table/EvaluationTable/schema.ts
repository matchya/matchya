import { z } from "zod"

export const assessmentSchema = z.object({
  criterion: z.object({
    id: z.string(),
    message: z.string(),
    keywords: z.array(z.string()),
    created_at: z.string()
  }),
  reason: z.string(),
  score: z.number()
})

export type Assessment = z.infer<typeof assessmentSchema>
