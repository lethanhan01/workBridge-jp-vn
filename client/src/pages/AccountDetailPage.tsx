import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { userApi } from "../api/userApi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { vi, ja } from "date-fns/locale";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  Mail,
  Building,
  Briefcase,
  Globe,
  Calendar,
  Activity,
  Edit,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  User,
  Clock,
} from "lucide-react";
import { useLanguage } from "../utils/contexts/LanguageContext";

interface Account {
  id: string;
  name: string;
  email: string;
  department: string;
  department_jp?: string;
  nationality: "japan" | "vietnam";
  gender: "male" | "female" | "other";
  password: string;
  position: string;
  position_jp?: string;
  status: "active" | "inactive";
  joinDate: string;
  lastActive: string;
  isOnline?: boolean;
  lastActiveDate?: string;
  messageCount: number;
  translationCount: number;
  partnersCount: number;
  language: string;
  role?: "admin" | "user";
  recentActivity: any[];
}

const mockAccount: Account = {
  id: "1",
  name: "田中健太",
  email: "tanaka.kenta@company.com",
  department: "営業部 / Sales Department",
  nationality: "japan",
  gender: "male",
  password: "SecurePass123!",
  position: "課長 / Section Manager",
  status: "active",
  joinDate: "2024年1月15日",
  lastActive: "2分前",
  messageCount: 1234,
  translationCount: 856,
  partnersCount: 150,
  language: "日本語 / Tiếng Nhật",
  recentActivity: [],
};

// Xóa mock recentActivity ở đây vì đã lấy từ API

export function AccountDetailPage() {
  const { t, language } = useLanguage();
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [editedAccount, setEditedAccount] = useState<Account | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!accountId) return;
    const fetchUser = async () => {
      try {
        const data = await userApi.getUserById(accountId);
        const formattedAccount: Account = {
          id: data.ma_nguoi_dung,
          name: data.ten || data.ten_dang_nhap || "No Name",
          email: data.email,
          department: data.phong_ban || "",
          department_jp: data.phong_ban_jp || "",
          nationality: data.ma_ngon_ngu === "ja" ? "japan" : "vietnam",
          gender: "other",
          password: "••••••••", // Không lưu trữ mật khẩu rõ trên frontend
          position: data.chuc_vu || "",
          position_jp: data.chuc_vu_jp || "",
          status: "active",
          joinDate: "",
          lastActive: "",
          isOnline: data.trang_thai_online || false,
          lastActiveDate: data.lan_cuoi_hoat_dong || null,
          messageCount: data.messageCount || 0,
          translationCount: data.translationCount || 0,
          partnersCount: data.partnersCount || 0,
          language: data.ma_ngon_ngu === "ja" ? "日本語 / Tiếng Nhật" : "Tiếng Việt / ベトナム語",
          role: data.vai_tro && data.vai_tro.ten_vai_tro && data.vai_tro.ten_vai_tro.trim() === "admin" ? "admin" : "user",
          recentActivity: data.recentActivity || [],
        };
        setAccount(formattedAccount);
        setEditedAccount(formattedAccount);
      } catch (err) {
        console.error("Failed to load account details", err);
      }
    };
    fetchUser();
  }, [accountId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleToggleRole = async () => {
    if (!account) return;
    const newRole = account.role === "admin" ? "user" : "admin";
    try {
      await userApi.updateUserAdmin(account.id, { role: newRole });
      setAccount({ ...account, role: newRole });
      toast.success(t("権限を更新しました", "Đã cập nhật quyền thành công"));
    } catch (error) {
      console.error("Toggle role error:", error);
      toast.error(t("エラーが発生しました", "Đã xảy ra lỗi khi cập nhật quyền"));
    }
  };

  const handleSave = async () => {
    try {
      if (accountId && editedAccount) {
        await userApi.updateUserAdmin(accountId, {
          phong_ban: editedAccount.department,
          chuc_vu: editedAccount.position,
          input_language: language
        });
        
        // Cần fetch lại hoặc tự giả định ngôn ngữ để cập nhật lại state.
        // Tạm thời gọi lại fetchUser hoặc reload.
        window.location.reload();
        toast.success(t("保存しました", "Đã lưu thành công"));
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(t("エラーが発生しました", "Đã xảy ra lỗi"));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAccount(account);
  };

  if (!account || !editedAccount) {
    return <div className="p-8 text-center">{t("読み込み中...", "Đang tải...")}</div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/app/accounts")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("戻る", "Quay lại")}
        </Button>

        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {account.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-1">{account.name}</h2>
                    <p className="text-gray-600">{language === 'ja' ? (account.position_jp || account.position) : account.position}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge
                      variant="outline"
                      className={
                        account.nationality === "japan"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {account.nationality === "japan"
                        ? "🇯🇵 日本"
                        : "🇻🇳 ベトナム"}
                    </Badge>
                    {account.isOnline ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-200"
                      >
                        {t("オンライン", "Đang hoạt động")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        {t("オフライン", "Không hoạt động")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{account.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{language === 'ja' ? (account.department_jp || account.department) : account.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{language === 'ja' ? (account.position_jp || account.position) : account.position}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>
                      {account.gender === "male"
                        ? t("男性", "Nam")
                        : account.gender === "female"
                        ? t("女性", "Nữ")
                        : t("その他", "Khác")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{account.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="flex items-center gap-2">
                      {showPassword ? account.password : "••••••••"}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t("入社日", "Ngày vào")}: {account.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {account.lastActiveDate ? (
                        formatDistanceToNow(new Date(account.lastActiveDate), { locale: language === "ja" ? ja : vi })
                      ) : (
                        t("不明", "Chưa rõ")
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t("編集", "Chỉnh sửa")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("メッセージ数", "Tin nhắn")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{account.messageCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("送信したメッセージの総数", "Tổng số tin nhắn đã gửi")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("翻訳数", "Bản dịch")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{account.translationCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("翻訳したメッセージの総数", "Tổng số tin nhắn đã dịch")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("会話相手", "Đối tác trò chuyện")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{account.partnersCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("アクティブな会話の数", "Tổng số người dùng")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("最近のアクティビティ", "Hoạt động gần đây")}</CardTitle>
            <CardDescription>
              {t("ユーザーの最近の行動履歴", "Lịch sử hoạt động gần đây của người dùng")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {account.recentActivity && account.recentActivity.length > 0 ? (
                account.recentActivity.map((activity) => {
                  let relativeTime = activity.time;
                  try {
                    const diffMs = Date.now() - new Date(activity.time).getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);
                    const diffDays = Math.floor(diffHours / 24);
                    if (diffMins < 60) relativeTime = `${diffMins} ${t("分前", "phút trước")}`;
                    else if (diffHours < 24) relativeTime = `${diffHours} ${t("時間前", "giờ trước")}`;
                    else relativeTime = `${diffDays} ${t("日前", "ngày trước")}`;
                  } catch (e) {}

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "message"
                            ? "bg-blue-100"
                            : activity.type === "translation"
                            ? "bg-green-100"
                            : "bg-purple-100"
                        }`}
                      >
                        {activity.type === "message" ? (
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        ) : activity.type === "translation" ? (
                          <Globe className="w-5 h-5 text-green-600" />
                        ) : (
                          <Building className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-600">
                          {activity.descriptionVn}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {relativeTime}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {t("最近のアクティビティはありません", "Chưa có hoạt động nào gần đây")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("権限設定", "Cài đặt quyền")}</CardTitle>
            <CardDescription>
              {t("ユーザーの権限を管理します", "Quản lý quyền của người dùng")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm">
                    {t("メッセージ送信", "Gửi tin nhắn")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("他のユーザーとチャットできます", "Có thể chat với người dùng khác")}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">{t("許可済", "Đã cho phép")}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm">
                    {t("辞書管理", "Quản lý từ điển")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("辞書の追加・編集ができます", "Có thể thêm và chỉnh sửa từ điển")}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">{t("許可済", "Đã cho phép")}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm">
                    {t("管理者権限", "Quyền quản trị")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("システム設定を変更できます", "Có thể thay đổi cài đặt hệ thống")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`cursor-pointer transition-colors ${account.role === "admin" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    onClick={handleToggleRole}
                  >
                    {account.role === "admin" ? t("許可済", "Đã cho phép") : t("未許可", "Chưa cho phép")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{t("アカウント編集", "Chỉnh sửa tài khoản")}</DialogTitle>
              <DialogDescription>
                {t("アカウント情報を更新します", "Cập nhật thông tin tài khoản")}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable content area */}
            <div className="overflow-y-auto max-h-[calc(80vh-180px)] px-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t("名前", "Tên")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="edit-name"
                      value={editedAccount.name}
                      onChange={(e) =>
                        setEditedAccount({ ...editedAccount, name: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">{t("メールアドレス", "Email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="edit-email"
                      type="email"
                      value={editedAccount.email}
                      onChange={(e) =>
                        setEditedAccount({ ...editedAccount, email: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nationality">{t("国籍", "Quốc tịch")}</Label>
                  <Select
                    value={editedAccount.nationality}
                    onValueChange={(value) =>
                      setEditedAccount({
                        ...editedAccount,
                        nationality: value as "japan" | "vietnam",
                      })
                    }
                  >
                    <SelectTrigger id="edit-nationality">
                      <SelectValue>
                        {editedAccount.nationality === "japan"
                          ? t("🇯🇵 日本", "🇯🇵 Nhật Bản")
                          : t("🇻🇳 ベトナム", "🇻🇳 Việt Nam")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="japan">{t("🇯🇵 日本", "🇯🇵 Nhật Bản")}</SelectItem>
                      <SelectItem value="vietnam">{t("🇻🇳 ベトナム", "🇻🇳 Việt Nam")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-gender">{t("性別", "Giới tính")}</Label>
                  <Select
                    value={editedAccount.gender}
                    onValueChange={(value) =>
                      setEditedAccount({
                        ...editedAccount,
                        gender: value as "male" | "female" | "other",
                      })
                    }
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue>
                        {editedAccount.gender === "male"
                          ? t("男性", "Nam")
                          : editedAccount.gender === "female"
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
                  <Label htmlFor="edit-department">{t("部署", "Phòng ban")}</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="edit-department"
                      value={editedAccount.department}
                      onChange={(e) =>
                        setEditedAccount({
                          ...editedAccount,
                          department: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">{t("パスワード", "Mật khẩu")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="edit-password"
                      type={showEditPassword ? "text" : "password"}
                      value={editedAccount.password}
                      onChange={(e) =>
                        setEditedAccount({ ...editedAccount, password: e.target.value })
                      }
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                    >
                      {showEditPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("パスワードを変更しない場合は、現在のパスワードのままにしてください", "Nếu không thay đổi mật khẩu, hãy giữ nguyên")}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                {t("キャンセル", "Hủy bỏ")}
              </Button>
              <Button type="button" onClick={handleSave}>
                {t("保存", "Lưu")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
