import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { AIEstimateData, ContactInfo } from '../../lib/ai/types';
import { getTextContent } from './ChatMessages';
import { fetchSuggestions } from '../../lib/ai/suggest';
import CategoryCards from './CategoryCards';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import SuggestionButtons from './SuggestionButtons';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'generate_estimate') {
        const args = toolCall.args as unknown as AIEstimateData;
        setEstimateData(args);
        setPhase('preview');
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (status !== 'ready') return;
    if (phase !== 'chat') return;
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;

    const simplified = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: getTextContent(m) }))
      .filter((m) => m.content.length > 0);

    setIsFetchingSuggestions(true);
    fetchSuggestions(simplified)
      .then(setSuggestions)
      .finally(() => setIsFetchingSuggestions(false));
  }, [status, messages.length, phase]);

  const handleCategorySelect = (initialMessage: string | null) => {
    setPhase('chat');
    if (initialMessage) {
      sendMessage({ text: initialMessage });
    }
  };

  const handleSend = (text: string) => {
    setSuggestions([]);
    sendMessage({ text });
  };

  const handleBackToChat = () => {
    setPhase('chat');
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
        <>
          <ChatMessages messages={messages} isLoading={isLoading} />
          <SuggestionButtons
            suggestions={suggestions}
            onSelect={handleSend}
            isLoading={isFetchingSuggestions}
          />
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </>
      )}

      {phase === 'preview' && estimateData && (
        <div className="flex-1 overflow-y-auto">
          <EstimatePreview
            estimate={estimateData}
            onBack={handleBackToChat}
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
