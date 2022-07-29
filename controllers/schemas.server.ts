import { invalidNumbers } from "@utils/index"
import { z } from "zod"

export const PostLiquidationSchema = z.object({
   customer: z.string(),
   plan: z.string(),
   amount: z.number().positive(),
   paid_at: z.string().refine((d) => !!new Date(d).getTime(), "Invalid date"),
   interest_payout: z.number().nonnegative().optional(),
   fee: z.number().nonnegative().optional(),
   id: z.string().optional(),
   status: z.enum(['success', 'failed']).default('success').optional(),
   validated: z.boolean().default(false).optional()
})

export const GetTrasactionsSchema = z.object({
   less_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   greater_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   time_period: z.enum(['1 week', '1 month', '3 months', '6 months']),
   status: z.enum(['success', 'abandoned', 'failed']).default('success'),
})