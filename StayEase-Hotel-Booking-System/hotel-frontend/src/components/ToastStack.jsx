import { BellRing, CircleAlert, CircleCheck } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const toneStyles = {
  info: "border-brass/40 bg-ink text-ivory",
  success: "border-sage/40 bg-ink text-ivory",
  warn: "border-wine/60 bg-ink text-ivory",
};

const toneIcon = {
  info: BellRing,
  success: CircleCheck,
  warn: CircleAlert,
};

export default function ToastStack() {
  const { toasts, dismiss } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = toneIcon[t.tone] || BellRing;
        return (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm shadow-lg shadow-black/20 transition hover:opacity-90 ${
              toneStyles[t.tone] || toneStyles.info
            }`}
          >
            <Icon size={18} className="mt-0.5 shrink-0 text-brass-light" />
            <span>{t.message}</span>
          </button>
        );
      })}
    </div>
  );
}
