import { useState, useEffect } from "react";
import { Link } from "react-router";
import { userApi } from "../api/userApi";
import { Input } from "../components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, UserPlus, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../utils/contexts/LanguageContext";
import {
  AddAccountDialog,
  type NewAccountInput,
} from "../components/account/AddAccountDialog";
import { formatDistanceToNow } from "date-fns";
import { vi, ja } from "date-fns/locale";

interface Account {
  id: string;
  name: string;
  email: string;
  department: string;
  department_jp?: string;
  nationality: "japan" | "vietnam";
  position: string;
  position_jp?: string;
  status: "active" | "inactive";
  lastActive: string;
  isOnline?: boolean;
  lastActiveDate?: string;
}

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "田中健太",
    email: "tanaka.kenta@company.com",
    department: "営業部 / Sales",
    nationality: "japan",
    position: "課長 / Manager",
    status: "active",
    lastActive: "2分前",
  },
  {
    id: "2",
    name: "Nguyễn Văn An",
    email: "nguyen.an@company.com",
    department: "開発部 / Development",
    nationality: "vietnam",
    position: "エンジニア / Engineer",
    status: "active",
    lastActive: "5分前",
  },
  {
    id: "3",
    name: "佐藤美咲",
    email: "sato.misaki@company.com",
    department: "人事部 / HR",
    nationality: "japan",
    position: "部長 / Director",
    status: "active",
    lastActive: "30分前",
  },
  {
    id: "4",
    name: "Trần Thị Mai",
    email: "tran.mai@company.com",
    department: "マーケティング / Marketing",
    nationality: "vietnam",
    position: "スペシャリスト / Specialist",
    status: "active",
    lastActive: "1時間前",
  },
  {
    id: "5",
    name: "山本隆",
    email: "yamamoto.takashi@company.com",
    department: "開発部 / Development",
    nationality: "japan",
    position: "シニアエンジニア / Senior Engineer",
    status: "inactive",
    lastActive: "2日前",
  },
  {
    id: "6",
    name: "Lê Văn Hùng",
    email: "le.hung@company.com",
    department: "営業部 / Sales",
    nationality: "vietnam",
    position: "営業担当 / Sales Rep",
    status: "active",
    lastActive: "15分前",
  },
  {
    id: "7",
    name: "鈴木花子",
    email: "suzuki.hanako@company.com",
    department: "デザイン / Design",
    nationality: "japan",
    position: "デザイナー / Designer",
    status: "active",
    lastActive: "10分前",
  },
  {
    id: "8",
    name: "Phạm Thị Lan",
    email: "pham.lan@company.com",
    department: "人事部 / HR",
    nationality: "vietnam",
    position: "HR担当 / HR Staff",
    status: "active",
    lastActive: "20分前",
  },
];

export function AccountListPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      const formattedAccounts: Account[] = data.map((u: any) => ({
        id: u.ma_nguoi_dung,
        name: u.ten || u.ten_dang_nhap || "No Name",
        email: u.email,
        department: u.phong_ban || "",
        department_jp: u.phong_ban_jp || "",
        nationality: u.ma_ngon_ngu === "ja" ? "japan" : "vietnam",
        position: u.chuc_vu || "",
        position_jp: u.chuc_vu_jp || "",
        status: "active",
        lastActive: "",
        isOnline: u.trang_thai_online || false,
        lastActiveDate: u.lan_cuoi_hoat_dong || null,
      }));
      setAccounts(formattedAccounts);
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const searchDept = language === 'ja' ? (account.department_jp || account.department) : account.department;
    
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchDept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNationality =
      nationalityFilter === "all" || account.nationality === nationalityFilter;

    const matchesStatus =
      statusFilter === "all" || account.status === statusFilter;

    return matchesSearch && matchesNationality && matchesStatus;
  });

  const handleAddAccount = async (newAccount: NewAccountInput) => {
    try {
      await userApi.createUser({
        ten: newAccount.name,
        email: newAccount.email,
        matkhau: newAccount.password,
        ma_ngon_ngu: newAccount.nationality === "japan" ? "ja" : "vi",
        phong_ban: newAccount.department,
        chuc_vu: newAccount.position,
        input_language: language
      });
      toast.success(t("アカウントが正常に作成されました", "Tạo tài khoản thành công"));
      setIsAddDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Lỗi khi tạo tài khoản:", error);
      toast.error(error.message || t("エラーが発生しました", "Đã xảy ra lỗi"));
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">
              {t("アカウント管理", "Quản lý tài khoản")}
            </h2>
            <p className="text-gray-600">
              {t("組織内のユーザーを管理", "Quản lý người dùng trong tổ chức")}
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {t("追加", "Thêm")}
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("検索とフィルター", "Tìm kiếm và Lọc")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t("検索", "Tìm kiếm") + "..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Nationality Filter */}
              <Select
                value={nationalityFilter}
                onValueChange={setNationalityFilter}
              >
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t("国籍", "Quốc tịch")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("すべて", "Tất cả")}</SelectItem>
                  <SelectItem value="japan">{t("日本", "Nhật Bản")}</SelectItem>
                  <SelectItem value="vietnam">{t("ベトナム", "Việt Nam")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t("ステータス", "Trạng thái")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("すべて", "Tất cả")}</SelectItem>
                  <SelectItem value="active">
                    {t("アクティブ", "Đang hoạt động")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("非アクティブ", "Không hoạt động")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {t("表示中", "Hiển thị")}: {filteredAccounts.length} / {accounts.length} {t("件", "tài khoản")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("ユーザー", "Người dùng")}</TableHead>
                    <TableHead>{t("部署", "Phòng ban")}</TableHead>
                    <TableHead>{t("役職", "Chức vụ")}</TableHead>
                    <TableHead>{t("国籍", "Quốc tịch")}</TableHead>
                    <TableHead>{t("ステータス", "Trạng thái")}</TableHead>
                    <TableHead>{t("最終アクティブ", "Hoạt động")}</TableHead>
                    <TableHead className="text-right">{t("操作", "Thao tác")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-gray-500">
                          {t("アカウントが見つかりません", "Không tìm thấy tài khoản")}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {account.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-sm text-gray-500">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{language === 'ja' ? (account.department_jp || account.department) : account.department}</TableCell>
                        <TableCell>{language === 'ja' ? (account.position_jp || account.position) : account.position}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              account.nationality === "japan"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                          >
                            {account.nationality === "japan"
                              ? "🇯🇵 JP"
                              : "🇻🇳 VN"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.isOnline ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {t("オンライン", "Đang hoạt động")}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                            >
                              {t("オフライン", "Không hoạt động")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {account.lastActiveDate ? (
                            formatDistanceToNow(new Date(account.lastActiveDate), { locale: language === "ja" ? ja : vi })
                          ) : (
                            t("不明", "Chưa rõ")
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/app/accounts/${account.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t("詳細", "Chi tiết")}
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddAccountDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddAccount}
        />
      </div>
    </div>
  );
}
