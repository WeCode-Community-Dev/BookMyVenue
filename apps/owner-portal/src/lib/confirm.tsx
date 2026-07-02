import toast from 'react-hot-toast'

export function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="font-medium text-zinc-900 leading-tight">{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-4 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
            onClick={() => { toast.dismiss(t.id); resolve(false); }}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] rounded-md shadow-sm transition-colors"
            onClick={() => { toast.dismiss(t.id); resolve(true); }}
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        border: '1px solid #e4e4e7',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        padding: '12px 16px',
      }
    });
  });
}
