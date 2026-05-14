import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Search, X, Users, MessageCircle, Check } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface Contact {
  id: string;
  name: string;
  nameJp: string;
  nameVn: string;
  email: string;
  department: string;
  nationality: "japan" | "vietnam";
  avatar: string;
}

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "田中健太",
    nameJp: "田中健太",
    nameVn: "Tanaka Kenta",
    email: "tanaka@company.com",
    department: "営業部 / Sales",
    nationality: "japan",
    avatar: "",
  },
  {
    id: "2",
    name: "佐藤美咲",
    nameJp: "佐藤美咲",
    nameVn: "Sato Misaki",
    email: "sato@company.com",
    department: "マーケティング / Marketing",
    nationality: "japan",
    avatar: "",
  },
  {
    id: "3",
    name: "Nguyễn Văn Hùng",
    nameJp: "グエン・ヴァン・フン",
    nameVn: "Nguyễn Văn Hùng",
    email: "hung.nguyen@company.com",
    department: "開発部 / Development",
    nationality: "vietnam",
    avatar: "",
  },
  {
    id: "4",
    name: "Trần Thị Mai",
    nameJp: "チャン・ティ・マイ",
    nameVn: "Trần Thị Mai",
    email: "mai.tran@company.com",
    department: "人事部 / HR",
    nationality: "vietnam",
    avatar: "",
  },
  {
    id: "5",
    name: "山田太郎",
    nameJp: "山田太郎",
    nameVn: "Yamada Taro",
    email: "yamada@company.com",
    department: "技術部 / Technical",
    nationality: "japan",
    avatar: "",
  },
  {
    id: "6",
    name: "Lê Văn Đức",
    nameJp: "レ・ヴァン・ドゥック",
    nameVn: "Lê Văn Đức",
    email: "duc.le@company.com",
    department: "営業部 / Sales",
    nationality: "vietnam",
    avatar: "",
  },
];

export function NewConversationDialog({
  open,
  onClose,
}: NewConversationDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const removeSelectedContact = (contactId: string) => {
    setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
  };

  const handleCreateConversation = () => {
    if (selectedContacts.length === 0) return;

    if (selectedContacts.length === 1) {
      // 1-on-1 chat
      navigate(`/app/chat/${selectedContacts[0]}`);
    } else {
      // Group chat - tạo ID group từ các contact IDs
      const groupId = `group-${selectedContacts.sort().join("-")}`;
      navigate(`/app/chat/${groupId}`);
    }
    
    // Reset và đóng dialog
    setSelectedContacts([]);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSelectedContacts([]);
    setSearchQuery("");
    onClose();
  };

  const selectedContactsData = mockContacts.filter((contact) =>
    selectedContacts.includes(contact.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#4a9d9c]" />
            新しい会話を開始 / Bắt đầu hội thoại mới
          </DialogTitle>
          <DialogDescription>
            1人または複数人を選択してチャットを開始
            <br />
            Chọn một hoặc nhiều người để bắt đầu chat
          </DialogDescription>
        </DialogHeader>

        {/* Selected Contacts Pills */}
        {selectedContacts.length > 0 && (
          <div className="px-6 pb-3 shrink-0 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#4a9d9c]" />
              <span className="text-sm font-medium text-gray-700">
                選択中 / Đã chọn ({selectedContacts.length})
              </span>
            </div>
            <div className="max-h-24 overflow-y-auto">
              <div className="flex flex-wrap gap-2 pb-1">
                {selectedContactsData.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-2 bg-[#e8f5f5] border border-[#4a9d9c] rounded-full pl-3 pr-2 py-1"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-xs">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </span>
                    <button
                      onClick={() => removeSelectedContact(contact.id)}
                      className="ml-1 p-0.5 hover:bg-[#4a9d9c] hover:text-white rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-6 py-4 shrink-0 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="名前、メール、部署で検索 / Tìm theo tên, email, phòng ban..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Search className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    連絡先が見つかりません
                    <br />
                    Không tìm thấy liên hệ
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-[#4a9d9c] bg-[#e8f5f5] shadow-sm"
                          : "border-gray-200 hover:border-[#4a9d9c] hover:bg-[#f8fafa]"
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-[#4a9d9c] border-[#4a9d9c]"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>

                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {contact.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={
                              contact.nationality === "japan"
                                ? "bg-red-50 text-red-700 border-red-200 shrink-0"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0"
                            }
                          >
                            {contact.nationality === "japan" ? "🇯🇵 JP" : "🇻🇳 VN"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {contact.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.department}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
          <div className="text-sm text-gray-600">
            {selectedContacts.length === 0 ? (
              <>
                <span>メンバーを選択 / Chọn thành viên</span>
              </>
            ) : selectedContacts.length === 1 ? (
              <>
                <span className="font-medium text-[#4a9d9c]">
                  1人選択中 / 1 người đã chọn
                </span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 inline mr-1 text-[#4a9d9c]" />
                <span className="font-medium text-[#4a9d9c]">
                  グループチャット / Group chat ({selectedContacts.length} 人)
                </span>
              </>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={handleClose}>
              キャンセル / Hủy
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={selectedContacts.length === 0}
              className="bg-[#4a9d9c] hover:bg-[#3d8887]"
            >
              {selectedContacts.length <= 1 ? (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  チャット開始 / Bắt đầu
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  グループ作成 / Tạo nhóm
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
