import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "../components/ui/badge";
import { User, Mail, Building, Globe, Camera, Save, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../utils/contexts/LanguageContext";

export function ProfilePage() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: "田中健太",
    nameEn: "Tanaka Kenta",
    email: "tanaka.kenta@company.com",
    department: "営業部",
    departmentEn: "Sales Department",
    nationality: "japan",
    gender: "male",
    password: "SecurePass123!",
    position: "課長",
    positionEn: "Section Manager",
    language: "japanese",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success(t("プロフィールを更新しました", "Đã cập nhật hồ sơ"));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl mb-1">{t("プロフィール", "Hồ sơ cá nhân")}</h2>
          <p className="text-gray-600">
            {t("アカウント情報の管理", "Quản lý thông tin tài khoản")}
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("基本情報", "Thông tin cơ bản")}</CardTitle>
                <CardDescription>
                  {t("プロフィール情報を表示・編集します", "Hiển thị và chỉnh sửa thông tin hồ sơ")}
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? t("キャンセル", "Hủy") : t("編集", "Chỉnh sửa")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <h3 className="text-xl">{profile.name}</h3>
                <p className="text-gray-600">{profile.nameEn}</p>
                <Badge
                  className={
                    profile.nationality === "japan"
                      ? "bg-red-50 text-red-700 border-red-200 mt-2"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200 mt-2"
                  }
                  variant="outline"
                >
                  {profile.nationality === "japan" ? "🇯🇵 日本" : "🇻🇳 ベトナム"}
                </Badge>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("名前（日本語・ベトナム語）", "Tên")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("名前（英語）", "Tên (Tiếng Anh)")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="nameEn"
                    value={profile.nameEn}
                    onChange={(e) =>
                      setProfile({ ...profile, nameEn: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("メールアドレス", "Email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">{t("国籍", "Quốc tịch")}</Label>
                <Select
                  value={profile.nationality}
                  onValueChange={(value) =>
                    setProfile({ ...profile, nationality: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="japan">{t("日本", "Nhật Bản")}</SelectItem>
                    <SelectItem value="vietnam">{t("ベトナム", "Việt Nam")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">{t("性別", "Giới tính")}</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) =>
                    setProfile({ ...profile, gender: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {profile.gender === "male"
                        ? t("男性", "Nam")
                        : profile.gender === "female"
                        ? t("女性", "Nữ")
                        : t("その他", "Khác")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("男性", "Nam")}</SelectItem>
                    <SelectItem value="female">{t("女性", "Nữ")}</SelectItem>
                    <SelectItem value="other">{t("その他", "Khác")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  {t("部署（日本語・ベトナム語）", "Phòng ban")}
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) =>
                      setProfile({ ...profile, department: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentEn">
                  {t("部署（英語）", "Phòng ban (Tiếng Anh)")}
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="departmentEn"
                    value={profile.departmentEn}
                    onChange={(e) =>
                      setProfile({ ...profile, departmentEn: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">{t("役職", "Chức vụ")}</Label>
                <Input
                  id="position"
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({ ...profile, position: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">
                  {t("優先言語", "Ngôn ngữ ưu tiên")}
                </Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) =>
                    setProfile({ ...profile, language: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="japanese">{t("日本語", "Tiếng Nhật")}</SelectItem>
                    <SelectItem value="vietnamese">
                      {t("ベトナム語", "Tiếng Việt")}
                    </SelectItem>
                    <SelectItem value="english">{t("英語", "Tiếng Anh")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("パスワード", "Mật khẩu")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={profile.password}
                    onChange={(e) =>
                      setProfile({ ...profile, password: e.target.value })
                    }
                    disabled={!isEditing}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t("キャンセル", "Hủy")}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {t("保存", "Lưu")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
