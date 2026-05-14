import { Lightbulb, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../utils/contexts/LanguageContext";

interface Suggestion {
  id: string;
  text: string;
  translation: string;
  category: string;
  context: string;
}

interface SuggestionSidebarProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
  userNationality: "japan" | "vietnam";
  isOpen: boolean;
  onToggle: () => void;
}

// Function to translate category names
function translateCategory(category: string, language: "ja" | "vi"): string {
  const categoryMap: Record<string, { ja: string; vi: string }> = {
    "挨拶": { ja: "挨拶", vi: "Chào hỏi" },
    "感謝": { ja: "感謝", vi: "Cảm ơn" },
    "確認": { ja: "確認", vi: "Xác nhận" },
    "業務": { ja: "業務", vi: "Công việc" },
    "依頼": { ja: "依頼", vi: "Yêu cầu" },
    "謝罪": { ja: "謝罪", vi: "Xin lỗi" },
    "報告": { ja: "報告", vi: "Báo cáo" },
    "挨拶返信": { ja: "挨拶返信", vi: "Trả lời chào" },
    "返信": { ja: "返信", vi: "Trả lời" },
    "確認返信": { ja: "確認返信", vi: "Trả lời xác nhận" },
    "予定返信": { ja: "予定返信", vi: "Trả lời lịch" },
    "業務返信": { ja: "業務返信", vi: "Trả lời công việc" },
    "依頼返信": { ja: "依頼返信", vi: "Trả lời yêu cầu" },
    "完了返信": { ja: "完了返信", vi: "Trả lời hoàn thành" },
    "報告返信": { ja: "報告返信", vi: "Trả lời báo cáo" },
  };

  return categoryMap[category]?.[language] || category;
}

export function SuggestionSidebar({
  suggestions,
  onSelectSuggestion,
  userNationality,
  isOpen,
  onToggle,
}: SuggestionSidebarProps) {
  const { t, language } = useLanguage();

  return (
    <div className="relative flex h-full">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-10 top-20 z-10 w-10 h-12 bg-[#4a9d9c] hover:bg-[#3d8887] text-white rounded-l-lg shadow-lg flex items-center justify-center transition-all"
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Content */}
      {isOpen && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-[#e8f5f5]">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-medium text-[#1a2b4a]">
                💡 {t("返信の提案", "Gợi ý phản hồi")}
              </h3>
            </div>
            <p className="text-xs text-[#2d5958] break-words">
              {t("クリックしてメッセージを使用", "Click để sử dụng tin nhắn")}
            </p>
          </div>

          {/* Suggestions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 break-words">
                  {t(
                    "メッセージを受信すると提案が表示されます",
                    "Gợi ý sẽ hiển thị khi nhận được tin nhắn"
                  )}
                </p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  className="w-full h-auto p-3 flex flex-col items-start gap-2 hover:bg-[#e8f5f5] hover:border-[#4a9d9c] transition-all text-left"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs font-medium text-[#4a9d9c] bg-[#e8f5f5] px-2 py-0.5 rounded shrink-0">
                      {translateCategory(suggestion.category, language)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-900 font-medium leading-relaxed break-words whitespace-normal w-full">
                    {language === "ja" ? suggestion.text : suggestion.translation}
                  </p>

                  <p className="text-xs text-gray-400 italic mt-1 break-words whitespace-normal w-full">
                    {suggestion.context}
                  </p>
                </Button>
              ))
            )}
          </div>

          {/* Footer Tip */}
          <div className="p-3 border-t border-gray-200 bg-[#fdf8e8]">
            <p className="text-xs text-[#7d6620] text-center break-words">
              💡{" "}
              {t(
                "提案は文化的に適切な表現です",
                "Gợi ý sử dụng cách diễn đạt phù hợp văn hóa"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
