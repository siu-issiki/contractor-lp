import { SYSTEM_TYPES } from '../../../lib/constants';
import CategoryCard from '../CategoryCard';

interface SystemTypeStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SystemTypeStep({ value, onChange, error }: SystemTypeStepProps) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SYSTEM_TYPES.map((type) => (
          <CategoryCard
            key={type.id}
            id={type.id}
            label={type.label}
            icon={type.icon}
            selected={value === type.id}
            onClick={() => onChange(type.id)}
          />
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
