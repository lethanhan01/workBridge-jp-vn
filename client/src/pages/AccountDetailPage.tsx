import { useParams, useNavigate } from "react-router";
import { useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "../utils/contexts/LanguageContext";

interface Account {
  id: string;
  name: string;
  email: string;
  department: string;
  nationality: "japan" | "vietnam";
  gender: "male" | "female" | "other";
  password: string;
  position: string;
  status: "active" | "inactive";
  joinDate: string;
  lastActive: string;
  messageCount: number;
  translationCount: number;
  language: string;
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
  language: "日本語 / Tiếng Nhật",
};

const recentActivity = [
  {
    id: "1",
    type: "message",
    description: "Nguyễn Văn Anとメッセージを交換しました",
    descriptionVn: "Đã trao đổi tin nhắn với Nguyễn Văn An",
    time: "2分前",
  },
  {
    id: "2",
    type: "translation",
    description: "10件のメッセージを翻訳しました",
    descriptionVn: "Đã dịch 10 tin nhắn",
    time: "15分前",
  },
  {
    id: "3",
    type: "dictionary",
    description: '辞書に「納期」を追加しました',
    descriptionVn: 'Đã thêm "Hạn giao hàng" vào từ điển',
    time: "1時間前",
  },
  {
    id: "4",
    type: "message",
    description: "Trần Thị Maiとチャットを開始しました",
    descriptionVn: "Đã bắt đầu chat với Trần Thị Mai",
    time: "2時間前",
  },
];

export function AccountDetailPage() {
  const { t } = useLanguage();
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(mockAccount);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the editedAccount to the server
    console.log("Edited Account:", editedAccount);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAccount(mockAccount);
  };

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
                  {mockAccount.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-1">{mockAccount.name}</h2>
                    <p className="text-gray-600">{mockAccount.position}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge
                      variant="outline"
                      className={
                        mockAccount.nationality === "japan"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {mockAccount.nationality === "japan"
                        ? "🇯🇵 日本"
                        : "🇻🇳 ベトナム"}
                    </Badge>
                    <Badge
                      variant={
                        mockAccount.status === "active" ? "default" : "secondary"
                      }
                      className={
                        mockAccount.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {mockAccount.status === "active"
                        ? t("アクティブ", "Hoạt động")
                        : t("非アクティブ", "Không hoạt động")}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{mockAccount.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{mockAccount.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{mockAccount.position}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>
                      {mockAccount.gender === "male"
                        ? t("男性", "Nam")
                        : mockAccount.gender === "female"
                        ? t("女性", "Nữ")
                        : t("その他", "Khác")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{mockAccount.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="flex items-center gap-2">
                      {showPassword ? mockAccount.password : "••••••••"}
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
                      {t("入社日", "Ngày vào")}: {mockAccount.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>
                      {t("最終アクティブ", "Hoạt động")}: {mockAccount.lastActive}
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
              <p className="text-3xl">{mockAccount.messageCount}</p>
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
              <p className="text-3xl">{mockAccount.translationCount}</p>
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
              <p className="text-3xl">12</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("アクティブな会話の数", "Số cuộc trò chuyện đang hoạt động")}
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
              {recentActivity.map((activity) => (
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
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
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
                <Badge className="bg-gray-200 text-gray-700">{t("未許可", "Chưa cho phép")}</Badge>
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
