import type { UIMessage } from 'ai';
import { useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';

interface StepTimelineProps {
  messages: UIMessage[];
  isLoading: boolean;
  suggestions: string[];
  onSelect: (text: string) => void;
  multiSelect: boolean;
}

interface Step {
  question: string;
  answer: string | null;
}

function getTextContent(message: UIMessage): string {
  if (!message.parts) return '';
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

function deriveSteps(messages: UIMessage[]): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== 'assistant') continue;
    const text = getTextContent(msg);
    if (!text) continue;

    let answer: string | null = null;
    if (i + 1 < messages.length && messages[i + 1].role === 'user') {
      answer = getTextContent(messages[i + 1]);
    }
    steps.push({ question: text, answer });
  }
  return steps;
}

function renderMultilineText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function StepIcon({ status }: { status: 'completed' | 'current' | 'loading' }) {
  if (status === 'completed') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400">
        <CheckIcon />
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
      </div>
    );
  }
  // current
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex space-x-1.5">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <StepIcon status="loading" />
      <div className="pt-1">
        <LoadingDots />
      </div>
    </div>
  );
}

function StepItem({
  step,
  isLast,
  isCurrentStep,
  isLoading,
  totalSteps,
}: {
  step: Step;
  isLast: boolean;
  isCurrentStep: boolean;
  isLoading: boolean;
  totalSteps: number;
}) {
  const isCompleted = step.answer !== null;
  const iconStatus = isCurrentStep
    ? isLoading
      ? 'loading'
      : 'current'
    : 'completed';

  return (
    <div className={`relative ${isLast ? 'animate-step-appear' : ''}`}>
      <div className="flex items-start gap-3">
        <StepIcon status={iconStatus} />
        <div className="flex-1 min-w-0 pt-0.5">
          <p
            className={`text-sm leading-relaxed ${
              isCompleted ? 'text-gray-400' : 'text-gray-800 font-medium'
            }`}
          >
            {renderMultilineText(step.question)}
          </p>
          {isCompleted && step.answer && (
            <p className="mt-1 text-sm text-gray-400">
              回答: {renderMultilineText(step.answer)}
            </p>
          )}
          {isCurrentStep && isLoading && (
            <div className="mt-2">
              <LoadingDots />
            </div>
          )}
        </div>
      </div>
      {/* 縦線（最後のステップ以外） */}
      {!isLast && (
        <div
          className="absolute left-[11px] top-6 w-px bg-gray-200"
          style={{ bottom: `-${totalSteps > 1 ? 12 : 0}px` }}
        />
      )}
    </div>
  );
}

export default function StepTimeline({
  messages,
  isLoading,
  suggestions,
  onSelect,
  multiSelect,
}: StepTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = deriveSteps(messages);
  const hasCurrentStep = steps.length > 0 && steps[steps.length - 1].answer === null;
  const allCompleted = steps.length > 0 && !hasCurrentStep;

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  // 初回ローディング
  if (steps.length === 0 && isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {steps.map((step, i) => (
          <StepItem
            key={i}
            step={step}
            isLast={i === steps.length - 1}
            isCurrentStep={i === steps.length - 1 && step.answer === null}
            isLoading={isLoading}
            totalSteps={steps.length}
          />
        ))}
      </div>

      {/* QuestionCard: 現在のステップの直下 */}
      {hasCurrentStep && !isLoading && (
        <div className="pl-9 mt-3">
          <QuestionCard
            suggestions={suggestions}
            onSelect={onSelect}
            multiSelect={multiSelect}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* 全完了 + ローディング時 */}
      {allCompleted && isLoading && (
        <div className="mt-4">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
}
