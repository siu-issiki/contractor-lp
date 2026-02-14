import { FEATURES } from '../../../lib/constants';

interface FeaturesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function FeaturesStep({ value, onChange, error }: FeaturesStepProps) {
  const toggleFeature = (featureId: string) => {
    if (value.includes(featureId)) {
      onChange(value.filter((id) => id !== featureId));
    } else {
      onChange([...value, featureId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">必要な機能を選択</h2>
      <p className="text-sm text-gray-600 text-center mb-6">複数選択可。スキップも可能です。</p>
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((feature) => {
          const isSelected = value.includes(feature.id);
          return (
            <label
              key={feature.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary-300 ${
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFeature(feature.id)}
                  className="mt-1 accent-primary-500"
                />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
