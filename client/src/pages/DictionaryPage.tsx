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

import { useEffect } from "react";
import { dictionaryApi } from "../api/dictionaryApi";
import { toast } from "sonner";
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
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDictionary();
  }, []);

  const fetchDictionary = async () => {
    try {
      setLoading(true);
      const data = await dictionaryApi.getAll();
      setDictionary(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách từ điển:", error);
      toast.error(t("辞書の取得に失敗しました", "Lỗi lấy danh sách từ điển"));
    } finally {
      setLoading(false);
    }
  };

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

  const toggleFavorite = async (id: string) => {
    try {
      // Optimitistic update
      setDictionary(
        dictionary.map((entry) =>
          entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
        )
      );
      await dictionaryApi.toggleFavorite(id);
    } catch (error) {
      // Revert if error
      setDictionary(
        dictionary.map((entry) =>
          entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
        )
      );
      toast.error(t("お気に入りの更新に失敗しました", "Lỗi cập nhật yêu thích"));
    }
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
                className={`w-4 h-4 ${entry.isFavorite
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
