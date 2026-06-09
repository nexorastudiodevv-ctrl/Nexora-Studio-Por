import React from "react";
import { AppLanguage } from "../types";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  currentLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

export default function LanguageToggle({
  currentLanguage,
  onLanguageChange,
}: LanguageToggleProps) {
  const isAr = currentLanguage === "ar";

  return (
    <button
      id="lang-toggle-btn"
      onClick={() => onLanguageChange(isAr ? "en" : "ar")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-500 bg-white/80 dark:bg-slate-800/80 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-xs hover:shadow-xs transition-all pointer duration-150 cursor-pointer"
    >
      <Globe className="w-4 h-4 text-emerald-500 animate-pulse" />
      <span>{isAr ? "English" : "العربية"}</span>
    </button>
  );
}
