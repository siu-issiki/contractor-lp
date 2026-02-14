interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              i < currentStep
                ? 'bg-primary-500'
                : i === currentStep
                  ? 'bg-primary-500'
                  : 'bg-gray-200'
            }`}
            aria-label={`ステップ ${i + 1}${i === currentStep ? ' (現在)' : i < currentStep ? ' (完了)' : ''}`}
          />
          {i < totalSteps - 1 && (
            <div
              className={`w-8 h-1 mx-1 transition-colors ${
                i < currentStep ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
