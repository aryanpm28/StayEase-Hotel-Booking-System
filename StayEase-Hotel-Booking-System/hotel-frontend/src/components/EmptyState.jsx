export default function EmptyState({ title, description, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-ink/20 px-8 py-16 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="text-sm text-ink/60">{description}</p>}
      {action}
    </div>
  );
}
