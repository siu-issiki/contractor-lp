import { SCALES } from '../../../lib/constants';

interface ScaleStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ScaleStep({ value, onChange, error }: ScaleStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">プロジェクトの規模を選択</h2>
      <div className="space-y-3">
        {SCALES.map((scale) => (
          <button
            key={scale.id}
            type="button"
            onClick={() => onChange(scale.id)}
            className={`w-full border-2 rounded-xl p-5 cursor-pointer text-left transition-all hover:border-primary-300 hover:bg-primary-50 ${
              value === scale.id ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 bg-white'
            }`}
            aria-pressed={value === scale.id}
          >
            <div className="font-medium text-lg mb-1">{scale.label}</div>
            <div className="text-sm text-gray-600">{scale.description}</div>
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
