import { useEffect, useState } from "react";
import { Briefcase, Building, Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useLanguage } from "../../utils/contexts/LanguageContext";

export type AccountNationality = "japan" | "vietnam";
export type AccountGender = "male" | "female" | "other";

export interface NewAccountInput {
  name: string;
  email: string;
  nationality: AccountNationality;
  gender: AccountGender;
  department: string;
  position: string;
  password: string;
}

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (account: NewAccountInput) => void;
}

const createInitialAccount = (): NewAccountInput => ({
  name: "",
  email: "",
  nationality: "japan",
  gender: "male",
  department: "",
  position: "",
  password: "",
});

export function AddAccountDialog({ open, onClose, onAdd }: AddAccountDialogProps) {
  const { t } = useLanguage();
  const [newAccount, setNewAccount] = useState<NewAccountInput>(createInitialAccount());
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setNewAccount(createInitialAccount());
    setShowPassword(false);
  }, [open]);

  const handleCancel = () => {
    setNewAccount(createInitialAccount());
    setShowPassword(false);
    onClose();
  };

  const handleAddAccount = () => {
    onAdd(newAccount);
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("新規アカウント追加", "Thêm tài khoản mới")}</DialogTitle>
          <DialogDescription>
            {t("新しいユーザーアカウントを作成します", "Tạo tài khoản người dùng mới")}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(80vh-180px)] px-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">{t("名前", "Tên")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="pl-10"
                  placeholder={t("氏名を入力", "Nhập họ tên")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">{t("メールアドレス", "Email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-email"
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  className="pl-10"
                  placeholder="email@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-nationality">{t("国籍", "Quốc tịch")}</Label>
              <Select
                value={newAccount.nationality}
                onValueChange={(value) =>
                  setNewAccount({
                    ...newAccount,
                    nationality: value as AccountNationality,
                  })
                }
              >
                <SelectTrigger id="new-nationality">
                  <SelectValue placeholder={t("国籍を選択", "Chọn quốc tịch")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="japan">{t("🇯🇵 日本", "🇯🇵 Nhật Bản")}</SelectItem>
                  <SelectItem value="vietnam">{t("🇻🇳 ベトナム", "🇻🇳 Việt Nam")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-gender">{t("性別", "Giới tính")}</Label>
              <Select
                value={newAccount.gender}
                onValueChange={(value) =>
                  setNewAccount({
                    ...newAccount,
                    gender: value as AccountGender,
                  })
                }
              >
                <SelectTrigger id="new-gender">
                  <SelectValue placeholder={t("性別を選択", "Chọn giới tính")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("男性", "Nam")}</SelectItem>
                  <SelectItem value="female">{t("女性", "Nữ")}</SelectItem>
                  <SelectItem value="other">{t("その他", "Khác")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-department">{t("部署", "Phòng ban")}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-department"
                  value={newAccount.department}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, department: e.target.value })
                  }
                  className="pl-10"
                  placeholder={t("部署名を入力", "Nhập tên phòng ban")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-position">{t("役職", "Chức vụ")}</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-position"
                  value={newAccount.position}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, position: e.target.value })
                  }
                  className="pl-10"
                  placeholder={t("役職を入力", "Nhập chức vụ")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">{t("パスワード", "Mật khẩu")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="pl-10 pr-10"
                  placeholder={t("パスワードを入力", "Nhập mật khẩu")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t("キャンセル", "Hủy bỏ")}
          </Button>
          <Button type="button" onClick={handleAddAccount}>
            <UserPlus className="w-4 h-4 mr-2" />
            {t("追加", "Thêm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}