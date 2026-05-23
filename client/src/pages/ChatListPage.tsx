import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Search, MessageSquarePlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { NewConversationDialog } from "../components/chat/NewConversationDialog";
import { useLanguage } from "../utils/contexts/LanguageContext";
import { chatApi } from "../api/chatApi";
import { useEffect } from "react";


interface Contact {
  id: string;
  name: string;
  nameJp: string;
  nameVn: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  nationality: "japan" | "vietnam";
  isOnline: boolean;
}


export function ChatListPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const formatConversationName = (name: string) => {
    if (!name) return "";
    const prefixJa = "会話：";
    const prefixVi = "Đoạn chat cùng với ";
    
    if (name.startsWith(prefixJa)) {
      const members = name.substring(prefixJa.length);
      return t(`会話：${members}`, `Đoạn chat cùng với ${members}`);
    } else if (name.startsWith(prefixVi)) {
      const members = name.substring(prefixVi.length);
      return t(`会話：${members}`, `Đoạn chat cùng với ${members}`);
    }
    return name;
  };
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const data = await chatApi.getConversations();
        if (Array.isArray(data)) {
          // Map backend conversation to frontend Contact interface
          const mappedContacts: Contact[] = data.map((conv: any) => ({
            id: conv.ma_cuoc_hoi_thoai,
            name: conv.ten_cuoc_hoi_thoai || "Conversation",
            nameJp: conv.ten_cuoc_hoi_thoai || "Conversation",
            nameVn: conv.ten_cuoc_hoi_thoai || "Conversation",
            avatar: "",
            lastMessage: "Click to view chat",
            lastMessageTime: conv.ngay_tao ? new Date(conv.ngay_tao).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            unreadCount: 0,
            nationality: "vietnam", // Mặc định vì backend chưa trả về nationality của partner
            isOnline: false,
          }));

          setContacts(mappedContacts);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.nameJp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.nameVn.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl">{t("チャット", "Chat")}</h2>
            <p className="text-sm text-gray-500">
              {t("メッセージ一覧", "Danh sách tin nhắn")}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setShowNewConversation(true)}
            className="hover:bg-[#e8f5f5] hover:border-[#4a9d9c]"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t("検索", "Tìm kiếm") + "..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageSquarePlus className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-center">
              {t("連絡先が見つかりません", "Không tìm thấy liên hệ")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <Link
                key={contact.id}
                to={`/app/chat/${contact.id}`}
                className="flex items-start gap-3 p-4 hover:bg-[#f5f6f8] transition-colors"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {formatConversationName(contact.name)}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          contact.nationality === "japan"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {contact.nationality === "japan" ? "🇯🇵 JP" : "🇻🇳 VN"}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {contact.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {contact.lastMessage}
                    </p>
                    {contact.unreadCount > 0 && (
                      <Badge className="ml-2 bg-blue-600">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewConversation}
        onClose={() => setShowNewConversation(false)}
      />
    </div>
  );
}
