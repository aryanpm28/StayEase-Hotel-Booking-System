export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
      <p className="font-mono text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
