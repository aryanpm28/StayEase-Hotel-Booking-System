import { CircleAlert } from "lucide-react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-wine/30 bg-wine/5 px-4 py-3 text-sm text-wine">
      <CircleAlert size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
