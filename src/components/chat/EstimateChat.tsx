import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { z } from 'zod';
import type { AIEstimateData, ContactInfo } from '../../lib/ai/types';

const estimateDataSchema = z.object({
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
});
const questionUserSchema = z.object({
  options: z.array(z.string()).min(2).max(6),
  multiSelect: z.boolean().optional().default(false),
});
import CategoryCards from './CategoryCards';
import StepTimeline from './StepTimeline';
import EstimatePreview from './EstimatePreview';
import ContactForm from './ContactForm';
import SubmitSuccess from './SubmitSuccess';

type Phase = 'select' | 'chat' | 'preview' | 'contact' | 'success';

export default function EstimateChat() {
  const [phase, setPhase] = useState<Phase>('select');
  const [estimateData, setEstimateData] = useState<AIEstimateData | null>(null);
  const [estimateNumber, setEstimateNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const { messages, sendMessage, status, addToolOutput } = useChat({
    api: '/api/chat',
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'generate_estimate') {
        const parsed = estimateDataSchema.safeParse(toolCall.input);
        if (parsed.success) {
          setEstimateData(parsed.data);
          setPhase('preview');
        }
      }
      if (toolCall.toolName === 'question_user') {
        const parsed = questionUserSchema.safeParse(toolCall.input);
        if (parsed.success) {
          setQuestionOptions(parsed.data.options);
          setIsMultiSelect(parsed.data.multiSelect);
        } else {
          console.error('question_user parse error:', parsed.error.issues);
        }
        void addToolOutput({
          tool: 'question_user',
          toolCallId: toolCall.toolCallId,
          output: 'ユーザーに選択肢を表示しました。ユーザーの回答を待ちます。',
        });
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleCategorySelect = (initialMessage: string | null) => {
    setPhase('chat');
    if (initialMessage) {
      sendMessage({ text: initialMessage });
    }
  };

  const handleSend = (text: string) => {
    setQuestionOptions([]);
    setIsMultiSelect(false);
    sendMessage({ text });
  };

  const handleAcceptEstimate = () => {
    setPhase('contact');
  };

  const handleContactSubmit = async (contact: ContactInfo) => {
    if (!estimateData) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimate: estimateData,
          contact,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setEstimateNumber(data.estimateNumber);
      setPhase('success');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'エラーが発生しました'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden ${
        phase === 'select' ? 'h-auto min-h-[500px]' : 'h-[500px]'
      }`}
    >
      {phase === 'select' && (
        <CategoryCards onSelect={handleCategorySelect} />
      )}

      {phase === 'chat' && (
        <StepTimeline
          messages={messages}
          isLoading={isLoading}
          suggestions={questionOptions}
          onSelect={handleSend}
          multiSelect={isMultiSelect}
        />
      )}

      {phase === 'preview' && estimateData && (
        <div className="flex-1 overflow-y-auto">
          <EstimatePreview
            estimate={estimateData}
            onAccept={handleAcceptEstimate}
          />
        </div>
      )}

      {phase === 'contact' && (
        <div className="flex-1 overflow-y-auto">
          <ContactForm
            onSubmit={handleContactSubmit}
            onBack={() => setPhase('preview')}
            isSubmitting={isSubmitting}
          />
          {submitError && (
            <div className="px-6 pb-4">
              <p className="text-sm text-red-500">{submitError}</p>
            </div>
          )}
        </div>
      )}

      {phase === 'success' && (
        <div className="flex-1 flex items-center justify-center">
          <SubmitSuccess estimateNumber={estimateNumber} />
        </div>
      )}
    </div>
  );
}
