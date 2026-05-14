import { Lightbulb } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  translation: string;
  category: string;
}

interface SuggestionBoxProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
  position: { top: number; left: number };
}

export function SuggestionBox({
  suggestions,
  onSelectSuggestion,
  position,
}: SuggestionBoxProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-50 bg-white border border-[#4a9d9c] rounded-lg shadow-lg overflow-hidden min-w-[300px] max-w-[400px]"
      style={{
        bottom: position.top,
        left: position.left,
      }}
    >
      <div className="px-3 py-2 bg-[#e8f5f5] border-b border-[#6bb5b4] flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#d4af37]" />
        <span className="text-xs font-medium text-[#2d5958]">
          💡 提案 / Gợi ý
        </span>
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-[#e8f5f5] transition-colors border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-[#4a9d9c] font-medium mt-0.5 shrink-0">
                {suggestion.category}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  {suggestion.text}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestion.translation}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Tab キーで選択 / Nhấn Tab để chọn
        </p>
      </div>
    </div>
  );
}
