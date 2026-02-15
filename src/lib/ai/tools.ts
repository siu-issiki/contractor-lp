import { tool } from 'ai';
import { z } from 'zod';

export const estimateTools = {
  generate_estimate: tool({
    description:
      'プロジェクト要件に基づいて見積もりを生成します。ユーザーの要件を十分にヒアリングした後に呼び出してください。',
    inputSchema: z.object({
      projectSummary: z
        .string()
        .describe('プロジェクトの概要（1-2文で要約）'),
      lineItems: z
        .array(
          z.object({
            item: z.string().describe('項目名（例: Webアプリ開発 基本設計）'),
            quantity: z.number().int().positive().describe('数量'),
            unitPrice: z.number().int().nonnegative().describe('単価（円）'),
            amount: z.number().int().nonnegative().describe('金額（円）= quantity × unitPrice'),
          })
        )
        .min(1)
        .describe('見積もり明細行'),
      timeline: z.string().describe('想定納期（例: 約2ヶ月）'),
      notes: z
        .string()
        .optional()
        .describe('備考・補足事項（任意）'),
    }),
  }),
  question_user: tool({
    description:
      'ユーザーに選択肢を表示して回答を促します。選択肢は画面上にボタンとして表示されます。',
    inputSchema: z.object({
      options: z
        .array(z.string().describe('選択肢テキスト（10〜30文字程度）'))
        .min(2)
        .max(4)
        .describe('ユーザーに提示する選択肢（2〜4個）'),
    }),
  }),
};
