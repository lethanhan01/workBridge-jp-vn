import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  translatedText: string;
  sender: "me" | "other";
  timestamp: string;
  intent?: string;
  context?: string;
  culturalNotes?: string;
}

interface CulturalRewriteDialogProps {
  message: Message;
  onClose: () => void;
}

const rewriteOptions = [
  {
    style: "フォーマル / Trang trọng",
    japanese: "お疲れ様でございます。本日の会議資料につきまして、ご確認いただけますと幸いです。",
    vietnamese:
      "Xin chào. Về tài liệu cuộc họp hôm nay, tôi rất mong anh/chị có thể xem xét.",
    description:
      "ビジネスで最も丁寧な表現 / Cách diễn đạt lịch sự nhất trong kinh doanh",
  },
  {
    style: "ビジネスカジュアル / Bán trang trọng",
    japanese:
      "お疲れ様です。今日の会議資料を確認していただけますか？",
    vietnamese: "Chào anh/chị. Anh/chị có thể kiểm tra tài liệu cuộc họp hôm nay được không?",
    description:
      "日常的なビジネスシーン向け / Phù hợp cho tình huống kinh doanh hàng ngày",
  },
  {
    style: "カジュアル / Thân mật",
    japanese: "お疲れ様！今日の会議資料、見てもらえる？",
    vietnamese: "Chào bạn! Bạn có thể xem tài liệu cuộc họp hôm nay không?",
    description:
      "親しい同僚との会話向け / Phù hợp cho cuộc trò chuyện với đồng nghiệp thân thiết",
  },
];

export function CulturalRewriteDialog({
  message,
  onClose,
}: CulturalRewriteDialogProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      },
      (err) => {
        console.error("Failed to copy text:", err);
        // Fallback: try to use a temporary textarea for copying
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        } catch (fallbackErr) {
          console.error("Fallback copy also failed:", fallbackErr);
        }
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#4a9d9c]" />
            文化適応リライト / Viết lại theo văn hóa
          </DialogTitle>
          <DialogDescription>
            文化的背景に応じてメッセージを書き換えます
            <br />
            Viết lại tin nhắn theo bối cảnh văn hóa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Original Message */}
          <div>
            <h3 className="text-sm mb-2">
              元のメッセージ / Tin nhắn gốc
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{message.text}</p>
              <p className="text-xs text-gray-600 mt-2">
                {message.translatedText}
              </p>
            </div>
          </div>

          {/* Cultural Notes */}
          {message.culturalNotes && (
            <div className="p-3 bg-[#e8f5f5] border border-[#6bb5b4] rounded-lg">
              <h3 className="text-sm mb-2 text-[#2d5958] font-medium">
                文化的背景 / Bối cảnh văn hóa
              </h3>
              <p className="text-sm text-[#2d5958]">{message.culturalNotes}</p>
            </div>
          )}

          {/* Rewrite Options */}
          <div>
            <h3 className="text-sm mb-3">
              書き換えオプション / Tùy chọn viết lại
            </h3>
            <div className="space-y-3">
              {rewriteOptions.map((option, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-[#4a9d9c] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="bg-[#e8f5f5] text-[#2d5958] border-[#6bb5b4]"
                    >
                      {option.style}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(option.japanese + "\n" + option.vietnamese, index)
                      }
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          コピー済 / Đã sao
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          コピー / Sao chép
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm mb-1">{option.japanese}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {option.vietnamese}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Tips */}
          <div className="p-4 bg-[#fdf8e8] border border-[#e5c867] rounded-lg">
            <h3 className="text-sm mb-2 text-[#7d6620] font-medium">
              💡 文化的ヒント / Mẹo văn hóa
            </h3>
            <ul className="text-xs text-[#7d6620] space-y-1">
              <li>
                • 日本のビジネス文化では間接的な表現が好まれます / Văn hóa kinh doanh Nhật thích cách diễn đạt gián tiếp
              </li>
              <li>
                • 「お疲れ様です」は挨拶として広く使われています / 'Otsukaresama desu' được sử dụng rộng rãi như lời chào
              </li>
              <li>
                • ベトナム語では年齢・立場に応じた人称代名詞の使い分けが重要です / Trong tiếng Việt, việc sử dụng đại từ nhân xưng phù hợp với tuổi tác và vị trí là quan trọng
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
