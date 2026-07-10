import { X } from 'lucide-react';
type Props = {
  url: string;
  setOpen: (open: boolean) => void;
  title: string;
};

const ViewImage = ({ url, setOpen, title }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative">
        <button
          className="absolute top-4 right-4 z-60 rounded-full bg-secondary/20 border border-secondary p-3 text-sm font-semibold text-secondary shadow"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <img
          src={url}
          alt={title}
          className="max-h-[90vh] max-w-[90vw]  object-contain shadow-lg border border-secondary/50 rounded-3xl"
        />
      </div>
    </div>
  );
};

export default ViewImage;
