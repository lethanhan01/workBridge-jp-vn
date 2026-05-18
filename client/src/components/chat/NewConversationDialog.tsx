import { useState, useEffect } from "react";
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
import { Search, X, Users, MessageCircle, Check, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { chatApi } from "../../api/chatApi";

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

interface BackendUser {
  ma_nguoi_dung: string;
  ten: string;
  ten_dang_nhap: string;
  email: string;
  ma_ngon_ngu?: string;
}

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewConversationDialog({
  open,
  onClose,
}: NewConversationDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch users when dialog opens
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data: BackendUser[] = await chatApi.getUsers();

        // Map backend response to Contact interface
        const mappedContacts: Contact[] = data.map((user) => ({
          id: user.ma_nguoi_dung,
          name: user.ten,
          nameJp: user.ten,
          nameVn: user.ten,
          email: user.email,
          department: "",
          nationality: user.ma_ngon_ngu === "jp" ? "japan" : "vietnam",
          avatar: "",
        }));

        setContacts(mappedContacts);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Không thể tải danh sách người dùng / ユーザーリストの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open]);


  const filteredContacts = contacts.filter(
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

  const handleCreateConversation = async () => {
    if (selectedContacts.length === 0) return;

    try {
      setIsCreating(true);

      if (selectedContacts.length === 1) {
        // 1-on-1 chat - call API to create conversation
        const response = await chatApi.createConversation(selectedContacts[0]);
        const conversationId = response.ma_cuoc_hoi_thoai || selectedContacts[0];
        navigate(`/app/chat/${conversationId}`);
      } else {
        // Group chat - TODO: implement when backend supports group conversations
        alert("Tính năng chat nhóm sắp sửa! / グループチャット機能は準備中です！");
      }

      // Reset và đóng dialog
      setSelectedContacts([]);
      setSearchQuery("");
      onClose();
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError("Không thể tạo hội thoại / 会話の作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedContacts([]);
    setSearchQuery("");
    setError(null);
    onClose();
  };

  const selectedContactsData = contacts.filter((contact) =>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-32 text-center">
                <Loader2 className="w-8 h-8 text-[#4a9d9c] mb-3 animate-spin" />
                <p className="text-sm text-gray-600">
                  読み込み中... / Đang tải...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-32 text-center">
                <X className="w-12 h-12 text-red-300 mb-3" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  連絡先が見つかりません
                  <br />
                  Không tìm thấy liên hệ
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      disabled={isCreating}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isCreating ? "opacity-50 cursor-not-allowed" : ""
                      } ${
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
                        {contact.department && (
                          <p className="text-xs text-gray-500 truncate">
                            {contact.department}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              キャンセル / Hủy
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={selectedContacts.length === 0 || isCreating}
              className="bg-[#4a9d9c] hover:bg-[#3d8887]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  作成中... / Đang tạo...
                </>
              ) : selectedContacts.length <= 1 ? (
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
