import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Mail, Lock, User, Building } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { useLanguage } from "../utils/contexts/LanguageContext";


export function SignupPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    gender: "",
    department: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    gender: "",
    department: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    nationality: false,
    gender: false,
    department: false,
  });

  const validateField = (fieldName: string, value: string) => {
    let error = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = t("名前を入力してください", "Vui lòng nhập tên");
        }
        break;

      case "email":
        if (!value.trim()) {
          error = t("メールアドレスを入力してください", "Vui lòng nhập email");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = t("有効なメールアドレスを入力してください", "Email không hợp lệ");
        }
        break;


      case "password":
        if (!value) {
          error = t("パスワードを入力してください", "Vui lòng nhập mật khẩu");
        } else if (value.length < 8) {
          error = t("パスワードは8文字以上である必要があります", "Mật khẩu phải có ít nhất 8 ký tự");
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = t("パスワード確認を入力してください", "Vui lòng xác nhận mật khẩu");
        } else if (value !== formData.password) {
          error = t("パスワードが一致しません", "Mật khẩu không khớp");
        }
        break;

      case "nationality":
        if (!value) {
          error = t("国籍を選択してください", "Vui lòng chọn quốc tịch");
        }
        break;

      case "gender":
        if (!value) {
          error = t("性別を選択してください", "Vui lòng chọn giới tính");
        }
        break;

      case "department":
        if (!value.trim()) {
          error = t("部署を入力してください", "Vui lòng nhập phòng ban");
        }
        break;
    }

    return error;
  };

  const handleBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });

    // Validate on change if field has been touched
    if (touched[fieldName as keyof typeof touched]) {
      const error = validateField(fieldName, value);
      setErrors({ ...errors, [fieldName]: error });
    }

    // Also re-validate confirmPassword if password changes
    if (fieldName === "password" && touched.confirmPassword) {
      const confirmError = formData.confirmPassword !== value
        ? t("パスワードが一致しません", "Mật khẩu không khớp")
        : "";
      setErrors({ ...errors, password: "", confirmPassword: confirmError });
    }
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
    setTouched({ ...touched, [fieldName]: true });
    // Validate with the new value directly (not from state which hasn't updated yet)
    const error = validateField(fieldName, value);
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      nationality: true,
      gender: true,
      department: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
      nationality: validateField("nationality", formData.nationality),
      gender: validateField("gender", formData.gender),
      department: validateField("department", formData.department),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");

    if (hasErrors) {
      toast.error(t("入力エラーがあります", "Có lỗi trong form"));
      return;
    }

    try {
      // Gọi API đăng ký thực tế
      const response = await authApi.signup(formData);
      toast.success(response.message || t("アカウントが作成されました。ログインしてください", "Tài khoản đã được tạo. Vui lòng đăng nhập"));
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Đăng ký thất bại");
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("アカウント登録", "Đăng ký tài khoản")}</CardTitle>
        <CardDescription>
          {t("新しいアカウントを作成してください", "Tạo tài khoản mới")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("名前", "Tên")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder={t("山田太郎", "Nguyễn Văn A")}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className="pl-10"
              />
            </div>
            {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("メールアドレス", "Email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className="pl-10"
              />
            </div>
            {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">{t("国籍", "Quốc tịch")}</Label>
            <Select
              value={formData.nationality}
              onValueChange={(value) => handleSelectChange("nationality", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("選択してください", "Chọn")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="japan">{t("日本", "Nhật Bản")}</SelectItem>
                <SelectItem value="vietnam">{t("ベトナム", "Việt Nam")}</SelectItem>
              </SelectContent>
            </Select>
            {touched.nationality && errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">{t("性別", "Giới tính")}</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("選択してください", "Chọn")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("男性", "Nam")}</SelectItem>
                <SelectItem value="female">{t("女性", "Nữ")}</SelectItem>
                <SelectItem value="other">{t("その他", "Khác")}</SelectItem>
              </SelectContent>
            </Select>
            {touched.gender && errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">{t("部署", "Phòng ban")}</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="department"
                type="text"
                placeholder={t("営業部", "Phòng kinh doanh")}
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                onBlur={() => handleBlur("department")}
                className="pl-10"
              />
            </div>
            {touched.department && errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("パスワード", "Mật khẩu")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className="pl-10"
              />
            </div>
            {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("パスワード確認", "Xác nhận mật khẩu")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className="pl-10"
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button type="submit" className="w-full">
            {t("登録", "Đăng ký")}
          </Button>
          <p className="text-sm text-center text-gray-600">
            {t("すでにアカウントをお持ちですか？", "Đã có tài khoản?")}{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("ログイン", "Đăng nhập")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
