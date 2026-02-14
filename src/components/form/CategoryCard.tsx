interface CategoryCardProps {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

export default function CategoryCard({ id, label, icon, selected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-white border-2 rounded-xl p-5 cursor-pointer text-center transition-all hover:border-primary-300 hover:bg-primary-50 ${
        selected ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200'
      }`}
      aria-pressed={selected}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-medium text-sm">{label}</div>
    </button>
  );
}
