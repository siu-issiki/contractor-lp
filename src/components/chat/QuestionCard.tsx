import type { KeyboardEvent } from 'react';
import { useState, useEffect } from 'react';

interface QuestionCardProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  multiSelect: boolean;
  isLoading: boolean;
}

export default function QuestionCard({
  suggestions,
  onSelect,
  multiSelect,
  isLoading,
}: QuestionCardProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isOtherMode, setIsOtherMode] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [fallbackText, setFallbackText] = useState('');

  useEffect(() => {
    setSelectedItems(new Set());
    setIsOtherMode(false);
    setOtherText('');
    setFallbackText('');
  }, [suggestions]);

  if (isLoading) return null;

  // フォールバック入力欄（suggestions なし時）
  if (suggestions.length === 0) {
    const handleFallbackSubmit = () => {
      if (!fallbackText.trim() || isLoading) return;
      onSelect(fallbackText.trim());
      setFallbackText('');
    };

    const handleFallbackKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFallbackSubmit();
      }
    };

    return (
      <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          value={fallbackText}
          onChange={(e) => setFallbackText(e.target.value)}
          onKeyDown={handleFallbackKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 text-sm outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={handleFallbackSubmit}
          disabled={!fallbackText.trim() || isLoading}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowIcon />
        </button>
      </div>
    );
  }

  // 複数選択カード
  if (multiSelect) {
    const toggleItem = (text: string) => {
      setSelectedItems((prev) => {
        const next = new Set(prev);
        if (next.has(text)) {
          next.delete(text);
        } else {
          next.add(text);
        }
        return next;
      });
    };

    const handleOtherAdd = () => {
      if (!otherText.trim()) return;
      const text = otherText.trim();
      setSelectedItems((prev) => new Set(prev).add(text));
      setOtherText('');
    };

    const handleOtherKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOtherAdd();
      }
    };

    const handleSubmit = () => {
      if (selectedItems.size === 0) return;
      onSelect(Array.from(selectedItems).join('、'));
    };

    // カスタム項目（suggestionsに含まれないもの）
    const customItems = Array.from(selectedItems).filter(
      (item) => !suggestions.includes(item)
    );

    return (
      <div className="mx-4 mb-3 rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {suggestions.map((text, i) => {
            const isSelected = selectedItems.has(text);
            return (
              <button
                key={`${text}-${i}`}
                type="button"
                onClick={() => toggleItem(text)}
                className="animate-fade-in-up flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <CheckIcon />}
                </span>
                <span className="text-sm text-gray-700">{text}</span>
              </button>
            );
          })}

          {/* その他入力行 */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: `${suggestions.length * 80}ms` }}
          >
            {isOtherMode ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <PencilIcon />
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyDown={handleOtherKeyDown}
                  placeholder="入力して追加..."
                  autoFocus
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleOtherAdd}
                  disabled={!otherText.trim()}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowIcon />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsOtherMode(true)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <PencilIcon />
                <span className="text-sm text-gray-500">その他</span>
              </button>
            )}
          </div>
        </div>

        {/* カスタム項目チップ + フッター */}
        <div className="border-t border-gray-100 px-4 py-3">
          {customItems.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {customItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedItems((prev) => {
                        const next = new Set(prev);
                        next.delete(item);
                        return next;
                      })
                    }
                    className="ml-0.5 text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {selectedItems.size}件を選択中
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedItems.size === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 単一選択カード
  const handleOtherSubmit = () => {
    if (!otherText.trim()) return;
    onSelect(otherText.trim());
  };

  const handleOtherKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOtherSubmit();
    }
  };

  return (
    <div className="mx-4 mb-3 rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {suggestions.map((text, i) => (
          <button
            key={`${text}-${i}`}
            type="button"
            onClick={() => onSelect(text)}
            className="animate-fade-in-up group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-500">
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-gray-700">{text}</span>
            <span className="text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </button>
        ))}

        {/* その他入力行 */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: `${suggestions.length * 80}ms` }}
        >
          {isOtherMode ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <PencilIcon />
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onKeyDown={handleOtherKeyDown}
                placeholder="自由に入力..."
                autoFocus
                className="flex-1 text-sm outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={handleOtherSubmit}
                disabled={!otherText.trim()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowIcon />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsOtherMode(true)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <PencilIcon />
              <span className="text-sm text-gray-500">その他</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
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

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-gray-400"
    >
      <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
