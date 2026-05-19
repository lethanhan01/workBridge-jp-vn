import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Lightbulb, MessageCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../../utils/contexts/LanguageContext";

interface Suggestion {
  viText: string;
  jpText: string;
  score?: number;
}

interface Message {
  id: string;
  text: string;
  translatedText: string;
  sender: "me" | "other";
  timestamp: string;
  intent?: string;
  context?: string;
  culturalNotes?: string;
  suggestions?: Suggestion[];
}

interface MessageIntentDialogProps {
  message: Message;
  onClose: () => void;
  onSelectSuggestion?: (text: string) => void;
}

export function MessageIntentDialog({
  message,
  onClose,
}: MessageIntentDialogProps) {
  const { t, language } = useLanguage();

  const defaultSuggestions = [
    {
      ja: "了解しました。よろしくお願いします。",
      vi: "Tôi hiểu rồi. Rất mong được hợp tác.",
    },
    {
      ja: "ありがとうございます。確認します。",
      vi: "Cảm ơn bạn. Tôi sẽ kiểm tra.",
    },
    {
      ja: "承知しました。何かあればご連絡ください。",
      vi: "Tôi đã hiểu. Nếu có gì xin liên hệ với tôi.",
    },
  ];

  const suggestions = (message.suggestions && message.suggestions.length > 0)
    ? message.suggestions.map(s => ({ ja: s.jpText, vi: s.viText }))
    : defaultSuggestions;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#d4af37]" />
            {t("意図とコンテキスト", "Ý định và Ngữ cảnh")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "メッセージの背景情報を理解する",
              "Hiểu thông tin bối cảnh của tin nhắn"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Original Message */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm">
                {t("元のメッセージ", "Tin nhắn gốc")}
              </h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                {language === "ja" ? message.text : message.translatedText}
              </p>
            </div>
          </div>

          {/* Intent */}
          {message.intent && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm">{t("意図", "Ý định")}</h3>
              </div>
              <div className="p-3 bg-[#fdf8e8] border border-[#e5c867] rounded-lg">
                <p className="text-sm text-[#7d6620]">{message.intent}</p>
              </div>
            </div>
          )}

          {/* Context */}
          {message.context && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#4a9d9c]" />
                <h3 className="text-sm">{t("コンテキスト", "Ngữ cảnh")}</h3>
              </div>
              <div className="p-3 bg-[#e8f5f5] border border-[#6bb5b4] rounded-lg">
                <p className="text-sm text-[#2d5958]">{message.context}</p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div>
            <h3 className="text-sm mb-2">
              {t("提案された返信", "Các phản hồi gợi ý")}
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (onSelectSuggestion) {
                      onSelectSuggestion(language === "ja" ? suggestion.ja : suggestion.vi);
                    }
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm">
                    {language === "ja" ? suggestion.ja : suggestion.vi}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
