import { Outlet, Navigate, useLocation } from "react-router";
import { useEffect } from "react";
import { useLanguage } from "../utils/contexts/LanguageContext";
import { Button } from "../components/ui/button";


export function AuthLayout() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  // Redirect to login if at root
  useEffect(() => {
    if (location.pathname === "/") {
      window.location.href = "/login";
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f5] via-[#f5f6f8] to-[#fdf8e8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <div className="inline-flex items-center bg-white/80 rounded-lg p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage("ja")}
              className={`text-xs px-3 py-1.5 h-auto rounded ${
                language === "ja"
                  ? "bg-[#1a2b4a] text-white hover:bg-[#1a2b4a]/90"
                  : "text-gray-700 hover:bg-gray-100"
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
                  ? "bg-[#1a2b4a] text-white hover:bg-[#1a2b4a]/90"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Tiếng Việt
            </Button>
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[#1a2b4a]">WorkBridge JP-VN</h1>
          <p className="text-[#64748b]">
            {t(
              "日本とベトナムをつなぐコミュニケーションツール",
              "Công cụ giao tiếp kết nối Nhật Bản và Việt Nam"
            )}
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
