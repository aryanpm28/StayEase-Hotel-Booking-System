import { KeyRound } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-brass/20 bg-ink text-ivory/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-brass-light" />
          <span className="font-display text-lg text-ivory">StayEase</span>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} StayEase Hotels. Every stay, made easy.
        </p>
      </div>
    </footer>
  );
}
