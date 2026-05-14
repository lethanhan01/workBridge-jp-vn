import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  MessageSquare,
  BookOpen,
  User,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useAuth } from "../utils/contexts/AuthContext";
import { useLanguage } from "../utils/contexts/LanguageContext";
import { LanguageSwitch } from "../components/ui/language-switch";


export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation items based on role
  const userNavItems = [
    {
      path: "/app",
      icon: MessageSquare,
      label: t("チャット", "Chat"),
      exact: true,
    },
    {
      path: "/app/dictionary",
      icon: BookOpen,
      label: t("辞書", "Từ điển"),
    },
    {
      path: "/app/profile",
      icon: User,
      label: t("プロフィール", "Hồ sơ"),
    },
  ];

  const adminNavItems = [
    {
      path: "/app/accounts",
      icon: Users,
      label: t("アカウント", "Tài khoản"),
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#1a2b4a] text-white border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl text-white">WorkBridge JP-VN</h1>
          <p className="text-xs text-white/70 mt-1">
            {t("コミュニケーションツール", "Công cụ giao tiếp")}
          </p>
          <div className="mt-3">
            <LanguageSwitch />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-[#4a9d9c] text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-300 hover:bg-red-500/10 hover:text-red-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">{t("ログアウト", "Đăng xuất")}</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg">WorkBridge JP-VN</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 p-4 space-y-1 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("ja")}
                  className={`text-xs px-3 py-1.5 h-auto flex-1 rounded ${
                    language === "ja"
                      ? "bg-white text-[#1a2b4a] shadow-sm hover:bg-white"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                  日本語
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("vi")}
                  className={`text-xs px-3 py-1.5 h-auto flex-1 rounded ${
                    language === "vi"
                      ? "bg-white text-[#1a2b4a] shadow-sm hover:bg-white"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                  Tiếng Việt
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm">{t("ログアウト", "Đăng xuất")}</span>
            </Button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden md:mt-0 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
