interface SuggestionButtonsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  isLoading: boolean;
}

export default function SuggestionButtons({
  suggestions,
  onSelect,
  isLoading,
}: SuggestionButtonsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 px-4 py-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-gray-100 animate-pulse"
            style={{ width: `${80 + i * 20}px` }}
          />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {suggestions.map((text, i) => (
        <button
          key={`${text}-${i}`}
          type="button"
          onClick={() => onSelect(text)}
          className="animate-fade-in-up rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
