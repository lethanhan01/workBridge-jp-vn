import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../utils/contexts/AuthContext";
import { useLanguage } from "../utils/contexts/LanguageContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call login function from AuthContext
      const user = await login(email, password);
      
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/app/accounts");
      } else {
        navigate("/app");
      }
    } catch (error) {
      // Lỗi đã được xử lý bằng toast trong AuthContext
      console.error("Login component error:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ログイン", "Đăng nhập")}</CardTitle>
        <CardDescription>
          {t(
            "アカウントにログインしてください",
            "Đăng nhập vào tài khoản của bạn"
          )}
          <br />
          <br />
          <span className="text-xs text-[#4a9d9c]">
            💡{" "}
            {t(
              "ヒント: 管理者としてログインするには、メールに「admin」を含めてください",
              "Gợi ý: Để đăng nhập với quyền admin, sử dụng email có chứa \"admin\""
            )}
          </span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("メールアドレス", "Email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("パスワード", "Mật khẩu")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button type="submit" className="w-full">
            {t("ログイン", "Đăng nhập")}
          </Button>
          <p className="text-sm text-center text-gray-600">
            {t("アカウントをお持ちではありませんか？", "Chưa có tài khoản?")}{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              {t("登録", "Đăng ký")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
