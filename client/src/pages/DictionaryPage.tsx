import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, BookOpen, Star } from "lucide-react";
import { useLanguage } from "../utils/contexts/LanguageContext";

interface DictionaryEntry {
  id: string;
  termJp: string;
  termVn: string;
  category: string;
  definitionJp: string;
  definitionVn: string;
  exampleJp: string;
  exampleVn: string;
  isFavorite: boolean;
}

const mockDictionary: DictionaryEntry[] = [
  {
    id: "1",
    termJp: "納期",
    termVn: "Hạn giao hàng",
    category: "ビジネス / Kinh doanh",
    definitionJp: "商品やサービスを納める期日",
    definitionVn: "Thời hạn giao sản phẩm hoặc dịch vụ",
    exampleJp: "納期は来週の金曜日です。",
    exampleVn: "Hạn giao hàng là thứ Sáu tuần sau.",
    isFavorite: true,
  },
  {
    id: "2",
    termJp: "見積もり",
    termVn: "Báo giá",
    category: "ビジネス / Kinh doanh",
    definitionJp: "商品やサービスの価格を事前に計算して提示すること",
    definitionVn:
      "Tính toán và đưa ra giá của sản phẩm hoặc dịch vụ trước",
    exampleJp: "見積もりを送っていただけますか？",
    exampleVn: "Bạn có thể gửi báo giá cho tôi không?",
    isFavorite: false,
  },
  {
    id: "3",
    termJp: "検証",
    termVn: "Kiểm tra",
    category: "IT / Công nghệ thông tin",
    definitionJp: "正しいかどうかを確認すること",
    definitionVn: "Xác nhận xem có đúng hay không",
    exampleJp: "コードの検証を行います。",
    exampleVn: "Tiến hành kiểm tra mã.",
    isFavorite: true,
  },
  {
    id: "4",
    termJp: "リリース",
    termVn: "Phát hành",
    category: "IT / Công nghệ thông tin",
    definitionJp: "ソフトウェアやアプリケーションを公開すること",
    definitionVn: "Công bố phần mềm hoặc ứng dụng",
    exampleJp: "新バージョンを来月リリースします。",
    exampleVn: "Phát hành phiên bản mới vào tháng sau.",
    isFavorite: false,
  },
  {
    id: "5",
    termJp: "稟議",
    termVn: "Trình duyệt",
    category: "ビジネス / Kinh doanh",
    definitionJp: "会社の意思決定のために上司や関係者に許可を求めること",
    definitionVn:
      "Xin phép cấp trên hoặc người liên quan để đưa ra quyết định trong công ty",
    exampleJp: "稟議書を提出しました。",
    exampleVn: "Tôi đã nộp đơn trình duyệt.",
    isFavorite: false,
  },
  {
    id: "6",
    termJp: "工数",
    termVn: "Công sức",
    category: "プロジェクト管理 / Quản lý dự án",
    definitionJp: "作業に必要な人数と時間の量",
    definitionVn: "Lượng người và thời gian cần thiết cho công việc",
    exampleJp: "この作業の工数は3人日です。",
    exampleVn: "Công sức cho công việc này là 3 người-ngày.",
    isFavorite: true,
  },
  {
    id: "7",
    termJp: "カルテ",
    termVn: "Hồ sơ bệnh án",
    category: "医療 / Y tế",
    definitionJp: "患者の病歴や治療記録を記したもの",
    definitionVn: "Bản ghi chép lịch sử bệnh và điều trị của bệnh nhân",
    exampleJp: "カルテを確認してください。",
    exampleVn: "Vui lòng kiểm tra hồ sơ bệnh án.",
    isFavorite: false,
  },
  {
    id: "8",
    termJp: "投薬",
    termVn: "Kê đơn thuốc",
    category: "医療 / Y tế",
    definitionJp: "患者に薬を処方すること",
    definitionVn: "Kê đơn thuốc cho bệnh nhân",
    exampleJp: "投薬の記録を更新しました。",
    exampleVn: "Đã cập nhật hồ sơ kê đơn thuốc.",
    isFavorite: true,
  },
  {
    id: "9",
    termJp: "在庫",
    termVn: "Hàng tồn kho",
    category: "製造・物流 / Sản xuất & Logistics",
    definitionJp: "保管されている商品や材料",
    definitionVn: "Sản phẩm hoặc nguyên liệu được lưu trữ",
    exampleJp: "在庫を確認してください。",
    exampleVn: "Vui lòng kiểm tra hàng tồn kho.",
    isFavorite: false,
  },
  {
    id: "10",
    termJp: "出荷",
    termVn: "Xuất hàng",
    category: "製造・物流 / Sản xuất & Logistics",
    definitionJp: "商品を送り出すこと",
    definitionVn: "Gửi sản phẩm đi",
    exampleJp: "明日出荷予定です。",
    exampleVn: "Dự kiến xuất hàng vào ngày mai.",
    isFavorite: false,
  },
  {
    id: "11",
    termJp: "設計図",
    termVn: "Bản thiết kế",
    category: "建設・設計 / Xây dựng & Thiết kế",
    definitionJp: "建物や製品の詳細な計画図",
    definitionVn: "Bản vẽ chi tiết của công trình hoặc sản phẩm",
    exampleJp: "設計図を修正します。",
    exampleVn: "Sẽ chỉnh sửa bản thiết kế.",
    isFavorite: false,
  },
  {
    id: "12",
    termJp: "施工",
    termVn: "Thi công",
    category: "建設・設計 / Xây dựng & Thiết kế",
    definitionJp: "建設工事を実際に行うこと",
    definitionVn: "Thực hiện công trình xây dựng",
    exampleJp: "来週から施工を開始します。",
    exampleVn: "Sẽ bắt đầu thi công từ tuần sau.",
    isFavorite: true,
  },
  {
    id: "13",
    termJp: "決算",
    termVn: "Quyết toán",
    category: "会計・財務 / Kế toán & Tài chính",
    definitionJp: "会計年度の収支を確定すること",
    definitionVn: "Xác định thu chi trong năm tài chính",
    exampleJp: "決算書を作成中です。",
    exampleVn: "Đang lập báo cáo quyết toán.",
    isFavorite: false,
  },
  {
    id: "14",
    termJp: "請求書",
    termVn: "Hóa đơn",
    category: "会計・財務 / Kế toán & Tài chính",
    definitionJp: "代金の支払いを求める書類",
    definitionVn: "Chứng từ yêu cầu thanh toán",
    exampleJp: "請求書を発行しました。",
    exampleVn: "Đã phát hành hóa đơn.",
    isFavorite: true,
  },
  {
    id: "15",
    termJp: "売上",
    termVn: "Doanh số",
    category: "営業・販売 / Bán hàng & Kinh doanh",
    definitionJp: "商品やサービスを販売して得た金額",
    definitionVn: "Số tiền thu được từ bán sản phẩm hoặc dịch vụ",
    exampleJp: "今月の売上が目標を超えました。",
    exampleVn: "Doanh số tháng này đã vượt mục tiêu.",
    isFavorite: false,
  },
  {
    id: "16",
    termJp: "顧客",
    termVn: "Khách hàng",
    category: "営業・販売 / Bán hàng & Kinh doanh",
    definitionJp: "商品やサービスを購入する人や企業",
    definitionVn: "Người hoặc công ty mua sản phẩm hoặc dịch vụ",
    exampleJp: "顧客のニーズに応えます。",
    exampleVn: "Đáp ứng nhu cầu của khách hàng.",
    isFavorite: true,
  },
  {
    id: "17",
    termJp: "診察",
    termVn: "Khám bệnh",
    category: "医療 / Y tế",
    definitionJp: "医師が患者の病状を調べること",
    definitionVn: "Bác sĩ kiểm tra tình trạng bệnh của bệnh nhân",
    exampleJp: "診察室でお待ちください。",
    exampleVn: "Vui lòng đợi tại phòng khám.",
    isFavorite: false,
  },
  {
    id: "18",
    termJp: "処方箋",
    termVn: "Đơn thuốc",
    category: "医療 / Y tế",
    definitionJp: "医師が薬の種類や量を指示する文書",
    definitionVn: "Văn bản bác sĩ chỉ định loại và liều lượng thuốc",
    exampleJp: "処方箋を薬局に提出してください。",
    exampleVn: "Vui lòng nộp đơn thuốc tại hiệu thuốc.",
    isFavorite: false,
  },
  {
    id: "19",
    termJp: "バグ",
    termVn: "Lỗi",
    category: "IT / Công nghệ thông tin",
    definitionJp: "プログラムの不具合や誤り",
    definitionVn: "Sự cố hoặc lỗi trong chương trình",
    exampleJp: "バグを修正しました。",
    exampleVn: "Đã sửa lỗi.",
    isFavorite: true,
  },
  {
    id: "20",
    termJp: "デプロイ",
    termVn: "Triển khai",
    category: "IT / Công nghệ thông tin",
    definitionJp: "システムを本番環境に配置すること",
    definitionVn: "Đưa hệ thống lên môi trường thực tế",
    exampleJp: "本日デプロイを実施します。",
    exampleVn: "Hôm nay sẽ thực hiện triển khai.",
    isFavorite: false,
  },
  {
    id: "21",
    termJp: "調達",
    termVn: "Mua sắm",
    category: "製造・物流 / Sản xuất & Logistics",
    definitionJp: "必要な物資や材料を購入すること",
    definitionVn: "Mua vật tư hoặc nguyên liệu cần thiết",
    exampleJp: "部品の調達を開始します。",
    exampleVn: "Bắt đầu mua sắm linh kiện.",
    isFavorite: false,
  },
  {
    id: "22",
    termJp: "品質管理",
    termVn: "Quản lý chất lượng",
    category: "製造・物流 / Sản xuất & Logistics",
    definitionJp: "製品の品質を維持・向上させる活動",
    definitionVn: "Hoạt động duy trì và cải thiện chất lượng sản phẩm",
    exampleJp: "品質管理を強化します。",
    exampleVn: "Tăng cường quản lý chất lượng.",
    isFavorite: true,
  },
];

const categoryData = [
  { key: "all", ja: "すべて", vi: "Tất cả" },
  { key: "business", ja: "ビジネス", vi: "Kinh doanh" },
  { key: "it", ja: "IT", vi: "Công nghệ thông tin" },
  { key: "project", ja: "プロジェクト管理", vi: "Quản lý dự án" },
  { key: "medical", ja: "医療", vi: "Y tế" },
  { key: "manufacturing", ja: "製造・物流", vi: "Sản xuất & Logistics" },
  { key: "construction", ja: "建設・設計", vi: "Xây dựng & Thiết kế" },
  { key: "accounting", ja: "会計・財務", vi: "Kế toán & Tài chính" },
  { key: "sales", ja: "営業・販売", vi: "Bán hàng & Kinh doanh" },
];

export function DictionaryPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dictionary, setDictionary] = useState(mockDictionary);

  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "ビジネス / Kinh doanh": "business",
      "IT / Công nghệ thông tin": "it",
      "プロジェクト管理 / Quản lý dự án": "project",
      "医療 / Y tế": "medical",
      "製造・物流 / Sản xuất & Logistics": "manufacturing",
      "建設・設計 / Xây dựng & Thiết kế": "construction",
      "会計・財務 / Kế toán & Tài chính": "accounting",
      "営業・販売 / Bán hàng & Kinh doanh": "sales",
    };
    return categoryMap[category] || category;
  };

  const filteredEntries = dictionary.filter((entry) => {
    const matchesSearch =
      entry.termJp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.termVn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definitionJp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definitionVn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      getCategoryKey(entry.category) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const favoriteEntries = dictionary.filter((entry) => entry.isFavorite);

  const toggleFavorite = (id: string) => {
    setDictionary(
      dictionary.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };

  const getCategoryName = (category: string) => {
    const parts = category.split(" / ");
    return language === "ja" ? parts[0] : parts[1];
  };

  const EntryCard = ({ entry }: { entry: DictionaryEntry }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              {language === "ja" ? entry.termJp : entry.termVn}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getCategoryName(entry.category)}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(entry.id)}
            >
              <Star
                className={`w-4 h-4 ${
                  entry.isFavorite
                    ? "fill-[#d4af37] text-[#d4af37]"
                    : "text-gray-400"
                }`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm">
            {language === "ja" ? entry.definitionJp : entry.definitionVn}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm mb-1">
            <span className="text-gray-500">{t("例", "Ví dụ")}:</span>
          </p>
          <p className="text-sm">
            {language === "ja" ? entry.exampleJp : entry.exampleVn}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-xl">
            {t("専門用語辞書", "Từ điển chuyên ngành")}
          </h2>
          <p className="text-sm text-gray-500">
            {t(
              "ビジネス・技術用語の翻訳",
              "Dịch thuật ngữ kinh doanh & kỹ thuật"
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t("用語を検索...", "Tìm kiếm thuật ngữ...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4">
            <TabsList>
              <TabsTrigger value="all">
                <BookOpen className="w-4 h-4 mr-2" />
                {t("すべて", "Tất cả")} ({filteredEntries.length})
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="w-4 h-4 mr-2" />
                {t("お気に入り", "Yêu thích")} ({favoriteEntries.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="all" className="mt-0 p-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryData.map((category) => (
                  <Button
                    key={category.key}
                    variant={
                      selectedCategory === category.key ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {language === "ja" ? category.ja : category.vi}
                  </Button>
                ))}
              </div>

              {/* Entries */}
              {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <BookOpen className="w-12 h-12 mb-2 text-gray-300" />
                  <p className="text-center">
                    {t("用語が見つかりません", "Không tìm thấy thuật ngữ")}
                  </p>
                  <p className="text-center text-sm mt-2 text-[#4a9d9c]">
                    {t(
                      "システムに存在しない用語は、今後追加予定です",
                      "Thuật ngữ chưa có trong hệ thống sẽ sớm được bổ sung"
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0 p-4">
              {favoriteEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Star className="w-12 h-12 mb-2 text-gray-300" />
                  <p className="text-center">
                    {t(
                      "お気に入りの用語がありません",
                      "Chưa có thuật ngữ yêu thích"
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {favoriteEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
