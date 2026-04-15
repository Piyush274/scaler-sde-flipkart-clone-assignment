import { CATEGORIES } from '@/constants/categories';

interface CategoryBarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => {
  return (
    <div className="overflow-x-auto bg-card shadow-sm">
      <div className="container mx-auto flex items-center gap-2 px-4 py-3 md:justify-center md:gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selected === cat.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
