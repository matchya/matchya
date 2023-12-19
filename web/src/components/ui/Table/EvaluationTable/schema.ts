import { z } from "zod"

export const assessmentSchema = z.object({
  criterion: z.string(),
  message: z.string(),
  score: z.number()
})

export type Assessment = z.infer<typeof assessmentSchema>
