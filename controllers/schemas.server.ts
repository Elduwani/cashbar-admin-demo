import { invalidNumbers } from "@utils/index"
import { z } from "zod"

const CreatedBy = z.object({
   email: z.string().email(),
   role: z.enum(['Admin', 'Staff']).default('Admin')
})

export const UserSchema = z.object({
   id: z.string().optional(),
   username: z.string(),
   email: z.string(),
   confirmed: z.boolean().default(false),
   blocked: z.boolean().default(false),
   role: z.object({
      name: z.string(),
      description: z.string().optional()
   })
})

export const PostLiquidationSchema = z.object({
   customer: z.string(),
   plan: z.string(),
   subscription: z.string(),
   amount: z.number().positive(),
   paid_at: z.string().optional(), //will be overwritten by server time
   interest_payout: z.number().nonnegative().optional(),
   fee: z.number().nonnegative().optional(),
   id: z.string().optional(),
   status: z.enum(['success']).default('success').optional(),
   validated: z.boolean().default(false).optional()
})

export const PostExpenseSchema = z.object({
   id: z.string().optional(),
   amount: z.number().positive(),
   paid_at: z.string().optional(), //will be overwritten by server time
   description: z.string().optional(),
   reference: z.string().optional(),
   category: z.string().optional(),
   channel: z.enum(['bank', 'card', 'cash']).default('card').optional(),
   status: z.enum(['success']).default('success').optional(),
   validated: z.boolean().default(false).optional(),
   paid_by: CreatedBy,
   created_by: CreatedBy,
   recipient_meta: z.object({
      account_name: z.string(),
      account_number: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
      bank_name: z.string()
   }).optional()
})

export const GetTrasactionsSchema = z.object({
   less_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   greater_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   time_period: z.enum(['1 week', '1 month', '3 months', '6 months']),
   status: z.enum(['success', 'abandoned', 'failed']).default('success'),
})

export const GetSubscriptionsHistorySchema = z.object({
   plan: z.string(),
   customer: z.string()
})