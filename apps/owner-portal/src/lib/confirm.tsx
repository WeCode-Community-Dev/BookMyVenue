import toast from 'react-hot-toast'

export function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px] p-1">
        <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-ink-800 rounded-md transition-colors"
            onClick={() => { toast.dismiss(t.id); resolve(false); }}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-1.5 text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-md shadow-sm transition-colors"
            onClick={() => { toast.dismiss(t.id); resolve(true); }}
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      className: '!bg-white dark:!bg-ink-900 !text-zinc-900 dark:!text-zinc-100 !border !border-zinc-200 dark:!border-ink-800 !p-3 !shadow-lg',
    });
  });
}
