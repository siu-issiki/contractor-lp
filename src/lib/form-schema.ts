import { z } from 'zod';

export const estimateFormSchema = z.object({
  systemType: z.enum(['web_app', 'business_system', 'mobile_app', 'lp_website', 'other']),
  scale: z.enum(['small', 'medium', 'large', 'enterprise']),
  features: z.array(z.string()).default([]),
  timeline: z.enum(['asap', '1month', '3months', '6months', 'flexible']),
  contact: z.object({
    name: z.string().min(1, 'お名前を入力してください'),
    company: z.string().optional(),
    email: z.string().email('有効なメールアドレスを入力してください'),
    phone: z.string().optional(),
    message: z.string().optional(),
  }),
});

export type EstimateFormData = z.infer<typeof estimateFormSchema>;

export const stepSchemas = {
  0: z.object({ systemType: estimateFormSchema.shape.systemType }),
  1: z.object({ scale: estimateFormSchema.shape.scale }),
  2: z.object({ features: estimateFormSchema.shape.features }),
  3: z.object({ timeline: estimateFormSchema.shape.timeline }),
  4: z.object({ contact: estimateFormSchema.shape.contact }),
} as const;
