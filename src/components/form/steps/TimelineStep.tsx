import { TIMELINES } from '../../../lib/constants';

interface TimelineStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function TimelineStep({ value, onChange, error }: TimelineStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">希望納期を選択</h2>
      <div className="space-y-3">
        {TIMELINES.map((timeline) => (
          <button
            key={timeline.id}
            type="button"
            onClick={() => onChange(timeline.id)}
            className={`w-full border-2 rounded-xl p-5 cursor-pointer text-left transition-all hover:border-primary-300 hover:bg-primary-50 ${
              value === timeline.id ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 bg-white'
            }`}
            aria-pressed={value === timeline.id}
          >
            <div className="font-medium text-lg mb-1">{timeline.label}</div>
            {timeline.description && <div className="text-sm text-gray-600">{timeline.description}</div>}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
