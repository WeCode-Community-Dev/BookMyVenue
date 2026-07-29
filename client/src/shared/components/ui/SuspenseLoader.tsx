export default function SuspenseLoader() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 animate-fade-in">
      <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-xs font-semibold text-foreground/50 tracking-wide uppercase">
        Loading...
      </span>
    </div>
  );
}
