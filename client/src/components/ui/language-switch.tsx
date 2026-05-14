import { useLanguage } from "../../utils/contexts/LanguageContext";
import { Button } from "./button";

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-white/10 rounded-lg p-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("ja")}
        className={`text-xs px-3 py-1.5 h-auto rounded ${
          language === "ja"
            ? "bg-white text-[#1a2b4a] hover:bg-white"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        日本語
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("vi")}
        className={`text-xs px-3 py-1.5 h-auto rounded ${
          language === "vi"
            ? "bg-white text-[#1a2b4a] hover:bg-white"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
      >
        Tiếng Việt
      </Button>
    </div>
  );
}
