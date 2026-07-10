import { Plus } from 'lucide-react';

type Props = {
  onAddClick: () => void;
};

const CategoryHeader = ({ onAddClick }: Props) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted">
          Organize, curate, and manage all venue categories in the system
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-primary
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-primary/25
          transition-all
          duration-200
          hover:bg-accent
          hover:shadow-accent/30
          active:scale-[0.98]
        "
      >
        <Plus size={18} className="stroke-[2.5]" />
        Add Category
      </button>
    </div>
  );
};

export default CategoryHeader;
