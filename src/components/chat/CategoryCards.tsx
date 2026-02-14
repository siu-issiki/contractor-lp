interface CategoryCardsProps {
  onSelect: (initialMessage: string | null) => void;
}

const categories = [
  { label: 'ECサイト', message: 'ECサイト（オンラインショップ）の開発を検討しています。' },
  { label: '業務システム', message: '業務システムの開発を検討しています。' },
  { label: 'LP / Webサイト', message: 'LP・Webサイトの制作を検討しています。' },
  { label: 'モバイルアプリ', message: 'モバイルアプリの開発を検討しています。' },
  { label: 'Webアプリ', message: 'Webアプリケーションの開発を検討しています。' },
  { label: 'その他', message: null },
] as const;

export default function CategoryCards({ onSelect }: CategoryCardsProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        作りたいシステムの種類を選んでください
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => onSelect(cat.message)}
            className={`rounded-xl px-4 py-4 text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5 ${
              cat.message === null
                ? 'border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white'
                : 'border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
