import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "../utils/contexts/LanguageContext";

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl mb-4">404</h1>
        <h2 className="text-2xl mb-2">
          {t("ページが見つかりません", "Không tìm thấy trang")}
        </h2>
        <p className="text-gray-600 mb-8">
          {t(
            "お探しのページは存在しないか、移動した可能性があります。",
            "Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển."
          )}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/app">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("戻る", "Quay lại")}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/app">
              <Home className="w-4 h-4 mr-2" />
              {t("ホーム", "Trang chủ")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
