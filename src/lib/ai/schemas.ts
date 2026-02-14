import { z } from 'zod';

export const estimateSubmissionSchema = z.object({
  estimate: z.object({
    projectSummary: z.string().min(1),
    lineItems: z
      .array(
        z.object({
          item: z.string().min(1),
          quantity: z.number().int().positive(),
          unitPrice: z.number().int().nonnegative(),
          amount: z.number().int().nonnegative(),
        })
      )
      .min(1),
    timeline: z.string().min(1),
    notes: z.string().optional(),
  }),
  contact: z.object({
    name: z.string().min(1, 'お名前を入力してください'),
    company: z.string().optional(),
    email: z.string().email('有効なメールアドレスを入力してください'),
    phone: z.string().optional(),
    message: z.string().optional(),
  }),
});

export const contactSchema = estimateSubmissionSchema.shape.contact;
