import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Send,
  Lightbulb,
  Languages,
  PanelRightClose,
  PanelRight,
  Users,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  File,
  Download,
} from "lucide-react";
import { MessageIntentDialog } from "../components/chat/MessageIntentDialog";
import { SuggestionSidebar } from "../components/chat/SuggestionSidebar";
import { useLanguage } from "../utils/contexts/LanguageContext";
import { useAuth } from "../utils/contexts/AuthContext";
import { chatApi } from "../api/chatApi";
import { socketService } from "../services/socketService";


interface Suggestion {
  viText: string;
  jpText: string;
  score: 1 | 2 | 3; // muc_do_phu_hop
}

interface Message {
  id: string;
  text: string;
  translatedText: string;
  sender: "me" | "other";
  timestamp: string;
  intent?: string;
  context?: string;
  tone?: "trang trọng" | "thân mật" | "trung lập"; // sac_thai from DB
  suggestions?: Suggestion[]; // goi_y from DB
  analysisReady?: boolean; // true when AI analysis is complete
  senderNationality: "japan" | "vietnam";
  receiverNationality: "japan" | "vietnam";
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "おはようございます！今日のミーティングは10時からですね。",
    translatedText: "Chào buổi sáng! Cuộc họp hôm nay là từ 10 giờ đúng không?",
    sender: "other",
    timestamp: "09:30",
    intent: "確認と挨拶 / Xác nhận và chào hỏi",
    context: "朝の挨拶と予定の確認 / Chào buổi sáng và xác nhận lịch trình",
    senderNationality: "japan",
    receiverNationality: "vietnam",
  },
  {
    id: "2",
    text: "はい、そうです。資料の準備は完了しています。",
    translatedText: "Vâng, đúng vậy. Tài liệu đã được chuẩn bị xong.",
    sender: "me",
    timestamp: "09:32",
    intent: "確認と報告 / Xác nhận và báo cáo",
    context: "準備状況の報告 / Báo cáo tình trạng chuẩn bị",
    senderNationality: "vietnam",
    receiverNationality: "japan",
  },
  {
    id: "3",
    text: "ありがとうございます。助かります！",
    translatedText: "Cảm ơn bạn. Bạn đã giúp tôi rất nhiều!",
    sender: "other",
    timestamp: "09:33",
    intent: "感謝の表現 / Thể hiện lòng biết ơn",
    context:
      "日本文化では感謝を頻繁に表現します / Trong văn hóa Nhật, người ta thường xuyên bày tỏ lòng biết ơn",
    senderNationality: "japan",
    receiverNationality: "vietnam",
  },
];

// Suggestion data based on common phrases
const suggestionDatabase = [
  {
    id: "s1",
    keyword: "おはよう",
    text: "はようございます！お疲れ様です。",
    translation: "Chào buổi sáng! Otsukaresama desu.",
    category: "挨拶",
  },
  {
    id: "s2",
    keyword: "ありがと",
    text: "ありがとうございます。助かります。",
    translation: "Cảm ơn bạn. Bạn đã giúp tôi rất nhiều.",
    category: "感謝",
  },
  {
    id: "s3",
    keyword: "会議",
    text: "会議の時間を確認していただけますか？",
    translation: "Bạn có thể xác nhận thời gian cuộc họp không?",
    category: "確認",
  },
  {
    id: "s4",
    keyword: "資料",
    text: "資料を共有させていただきます。",
    translation: "Tôi xin phép chia sẻ tài liệu.",
    category: "業務",
  },
  {
    id: "s5",
    keyword: "よろしく",
    text: "よろしくお願いいたします。",
    translation: "Rất mong được sự hỗ trợ của bạn.",
    category: "依頼",
  },
  {
    id: "s6",
    keyword: "確認",
    text: "ご確認いただけますと幸いです。",
    translation: "Tôi rất mong bạn có thể xem xét.",
    category: "依頼",
  },
  {
    id: "s7",
    keyword: "すみません",
    text: "申し訳ございません。すぐに対応いたします。",
    translation: "Xin lỗi. Tôi sẽ xử lý ngay.",
    category: "謝罪",
  },
  {
    id: "s8",
    keyword: "時間",
    text: "お時間をいただけますでしょうか？",
    translation: "Bạn có thể dành chút thời gian không?",
    category: "依頼",
  },
  {
    id: "s9",
    keyword: "完了",
    text: "作業が完了しましたので、ご報告いたします。",
    translation: "Công việc đã hoàn tất nên tôi báo cáo với bạn.",
    category: "報告",
  },
  {
    id: "s10",
    keyword: "お疲れ",
    text: "お疲れ様でした。本日もありがとうございました。",
    translation: "Otsukaresama deshita. Cảm ơn vì hôm nay.",
    category: "挨拶",
  },
];

// Reply suggestions based on received message context
const replySuggestions = [
  // Greeting responses
  {
    id: "r1",
    triggers: ["おはよう", "こんにちは", "お疲れ"],
    text: "おはようございます！お疲れ様です。",
    translation: "Chào buổi sáng! Chúc bạn làm việc tốt.",
    category: "挨拶返信",
    context: "Phản hồi lời chào theo văn hóa Nhật",
  },
  // Thank you responses
  {
    id: "r2",
    triggers: ["ありがと", "感謝", "助かり"],
    text: "どういたしまして。また何かありましたら、お気軽にお声がけください。",
    translation: "Không có gì. Nếu có gì vui lòng cứ nhắn tin cho tôi.",
    category: "返信",
    context: "Phản hồi lời cảm ơn một cách lịch sự",
  },
  {
    id: "r3",
    triggers: ["ありがと", "感謝"],
    text: "いえいえ、こちらこそありがとうございます。",
    translation: "Không sao, tôi mới là người cần cảm ơn.",
    category: "返信",
    context: "Cách trả lời khiêm tốn theo văn hóa Nhật",
  },
  // Confirmation responses
  {
    id: "r4",
    triggers: ["確認", "チェック", "見て"],
    text: "はい、確認いたしました。問題ありません。",
    translation: "Vâng, tôi đã xác nhận. Không có vấn đề gì.",
    category: "確認返信",
    context: "Xác nhận đã kiểm tra",
  },
  {
    id: "r5",
    triggers: ["確認", "いかが", "どう"],
    text: "承知いたしました。すぐに確認させていただきます。",
    translation: "Tôi hiểu rồi. Tôi sẽ kiểm tra ngay.",
    category: "確認返信",
    context: "Phản hồi yêu cầu kiểm tra",
  },
  // Meeting/Schedule responses
  {
    id: "r6",
    triggers: ["会議", "ミーティング", "打ち合わせ"],
    text: "承知いたしました。会議室で お待ちしております。",
    translation: "Tôi hiểu rồi. Tôi sẽ đợi tại phòng họp.",
    category: "予定返信",
    context: "Xác nhận lịch họp",
  },
  {
    id: "r7",
    triggers: ["会議", "ミーティング", "時間"],
    text: "はい、10時からですね。よろしくお願いいたします。",
    translation: "Vâng, từ 10 giờ đúng không. Rất mong được hợp tác.",
    category: "予定返信",
    context: "Xác nhận thời gian",
  },
  // Document/Work responses
  {
    id: "r8",
    triggers: ["資料", "ドキュメント", "ファイル"],
    text: "資料を確認させていただきました。ご共有ありがとうございます。",
    translation: "Tôi đã xem tài liệu. Cảm ơn bạn đã chia sẻ.",
    category: "業務返信",
    context: "Phản hồi khi nhận tài liệu",
  },
  {
    id: "r9",
    triggers: ["資料", "準備"],
    text: "はい、資料は準備できております。送信いたします。",
    translation: "Vâng, tài liệu đã chuẩn bị xong. Tôi sẽ gửi.",
    category: "業務返信",
    context: "Phản hồi về việc chuẩn bị tài liệu",
  },
  // Apology responses
  {
    id: "r10",
    triggers: ["すみません", "申し訳", "ごめん"],
    text: "大丈夫です。お気になさらないでください。",
    translation: "Không sao. Đừng lo lắng.",
    category: "返信",
    context: "Phản hồi lời xin lỗi",
  },
  // Request responses
  {
    id: "r11",
    triggers: ["お願い", "いただけ", "もらえ"],
    text: "承知いたしました。対応させていただきます。",
    translation: "Tôi hiểu rồi. Tôi sẽ xử lý.",
    category: "依頼返信",
    context: "Chấp nhận yêu cầu",
  },
  {
    id: "r12",
    triggers: ["お願い", "よろしく"],
    text: "はい、こちらこそよろしくお願いいたします。",
    translation: "Vâng, tôi cũng rất mong được hợp tác.",
    category: "依頼返信",
    context: "Đáp lại lời nhờ vả",
  },
  // Completion/Report responses
  {
    id: "r13",
    triggers: ["完了", "終わり", "できました"],
    text: "お疲れ様でした。ありがとうございます。",
    translation: "Cảm ơn bạn đã cố gắng. Cảm ơn bạn.",
    category: "完了返信",
    context: "Phản hồi khi công việc hoàn thành",
  },
  {
    id: "r14",
    triggers: ["報告", "連絡"],
    text: "ご報告ありがとうございます。確認いたしました。",
    translation: "Cảm ơn báo cáo. Tôi đã xác nhận.",
    category: "報告返信",
    context: "Phản hồi báo cáo",
  },
];

// Function to translate category names
function translateCategory(category: string, language: "ja" | "vi"): string {
  const categoryMap: Record<string, { ja: string; vi: string }> = {
    "挨拶": { ja: "挨拶", vi: "Chào hỏi" },
    "感謝": { ja: "感謝", vi: "Cảm ơn" },
    "確認": { ja: "確認", vi: "Xác nhận" },
    "業務": { ja: "業務", vi: "Công việc" },
    "依頼": { ja: "依頼", vi: "Yêu cầu" },
    "謝罪": { ja: "謝罪", vi: "Xin lỗi" },
    "報告": { ja: "報告", vi: "Báo cáo" },
    "挨拶返信": { ja: "挨拶返信", vi: "Trả lời chào" },
    "返信": { ja: "返信", vi: "Trả lời" },
    "確認返信": { ja: "確認返信", vi: "Trả lời xác nhận" },
    "予定返信": { ja: "予定返信", vi: "Trả lời lịch" },
    "業務返信": { ja: "業務返信", vi: "Trả lời công việc" },
    "依頼返信": { ja: "依頼返信", vi: "Trả lời yêu cầu" },
    "完了返信": { ja: "完了返信", vi: "Trả lời hoàn thành" },
    "報告返信": { ja: "報告返信", vi: "Trả lời báo cáo" },
  };

  return categoryMap[category]?.[language] || category;
}

// Function to get culturally appropriate translation
function getCulturalTranslation(
  text: string,
  senderNationality: "japan" | "vietnam",
  receiverNationality: "japan" | "vietnam"
): string {
  // If sender is Japanese and receiver is Vietnamese
  if (senderNationality === "japan" && receiverNationality === "vietnam") {
    // Add Vietnamese cultural context
    const translations: Record<string, string> = {
      "お疲れ様です": "Chào bạn (Otsukaresama - Lời chào khi làm việc)",
      "助かります": "Bạn đã giúp tôi rất nhiều (cảm ơn chân thành)",
      "よろしくお願いいたします": "Rất mong được hợp tác (lời nhờ vả lịch sự)",
      "承知いたしました": "Tôi hiểu rồi (xác nhận tôn trọng)",
      "申し訳ございません": "Tôi rất xin lỗi (lời xin lỗi chính thức)",
      "ありがとうございます": "Cảm ơn bạn rất nhiều",
      "どういたしまして": "Không có gì (đáp lại lời cảm ơn)",
    };
    
    for (const [jp, vn] of Object.entries(translations)) {
      if (text.includes(jp)) {
        return text.replace(jp, vn);
      }
    }
  }
  
  // If sender is Vietnamese and receiver is Japanese
  if (senderNationality === "vietnam" && receiverNationality === "japan") {
    // Add Japanese cultural politeness
    const translations: Record<string, string> = {
      "Cảm ơn": "ありがとうございます (丁寧な感謝)",
      "Xin lỗi": "申し訳ございません (正式な謝罪)",
      "Vâng": "はい、承知いたしました (丁寧な確認)",
      "Được": "承知いたしました (敬意を表す確認)",
      "Tôi理解": "承知いたしました、理解しております",
    };
    
    for (const [vn, jp] of Object.entries(translations)) {
      if (text.includes(vn)) {
        return text.replace(vn, jp);
      }
    }
  }
  
  return "Dịch tự động: " + text;
}

const mockContact = {
  id: "1",
  name: "田中健太",
  nameJp: "田中健太",
  nameVn: "Tanaka Kenta",
  avatar: "",
  nationality: "japan" as const,
  departmentJp: "営業部",
  departmentVn: "Phòng kinh doanh",
  isOnline: true,
};

// Mock contacts for group chat
const allContacts = [
  {
    id: "1",
    name: "田中健太",
    nameJp: "田中健太",
    nameVn: "Tanaka Kenta",
    avatar: "",
    nationality: "japan" as const,
  },
  {
    id: "2",
    name: "佐藤美咲",
    nameJp: "佐藤美咲",
    nameVn: "Sato Misaki",
    avatar: "",
    nationality: "japan" as const,
  },
  {
    id: "3",
    name: "Nguyễn Văn Hùng",
    nameJp: "グエン・ヴァン・フン",
    nameVn: "Nguyễn Văn Hùng",
    avatar: "",
    nationality: "vietnam" as const,
  },
  {
    id: "4",
    name: "Trần Thị Mai",
    nameJp: "チャン・ティ・マイ",
    nameVn: "Trần Thị Mai",
    avatar: "",
    nationality: "vietnam" as const,
  },
  {
    id: "5",
    name: "山田太郎",
    nameJp: "山田太郎",
    nameVn: "Yamada Taro",
    avatar: "",
    nationality: "japan" as const,
  },
  {
    id: "6",
    name: "Lê Văn Đức",
    nameJp: "レ・ヴァン・ドゥック",
    nameVn: "Lê Văn Đức",
    avatar: "",
    nationality: "vietnam" as const,
  },
];

export function ChatPage() {
  const { t, language } = useLanguage();
  const { contactId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationName, setConversationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedMessageForIntent, setSelectedMessageForIntent] = useState<
    Message | null
  >(null);
  const [suggestions, setSuggestions] = useState<typeof suggestionDatabase>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [replySuggestionsState, setReplySuggestionsState] = useState<typeof replySuggestions>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map backend message to frontend Message interface
  const mapBackendMessage = (msg: any): Message => {
    const analysis = msg.phan_tich_y_nghia?.[0]; // Analysis is an array from join
    const suggestions: Suggestion[] = analysis?.goi_y?.map((s: any) => ({
      viText: s.noi_dung_tieng_viet,
      jpText: s.noi_dung_tieng_nhat,
      score: s.muc_do_phu_hop,
    })) || [];

    return {
      id: msg.ma_tin_nhan || Date.now().toString(),
      text: msg.noi_dung,
      translatedText: msg.bandich?.[0]?.noi_dung_da_dich || msg.noi_dung,
      sender: msg.ma_nguoi_gui === user?.id ? "me" : "other",
      timestamp: new Date(msg.time).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      intent: analysis?.tom_tat_y_dinh,
      tone: analysis?.sac_thai,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      analysisReady: !!analysis, // true if analysis exists
      senderNationality: msg.ma_nguoi_gui === user?.id ? (user?.nationality || "vietnam") : "japan",
      receiverNationality: msg.ma_nguoi_gui === user?.id ? "japan" : (user?.nationality || "vietnam"),
    };
  };

  useEffect(() => {
    if (!contactId || !user) return;

    // Connect to socket and join room
    socketService.connect();
    socketService.joinRoom(contactId);

    // Listen for new messages
    const unsubscribe = socketService.onMessage((msg) => {
      if (msg.ma_cuoc_hoi_thoai === contactId) {
        setMessages(prev => [...prev, mapBackendMessage(msg)]);
      }
    });

    // Listen for AI analysis ready
    const unsubscribeAiReady = socketService.onMessageAiReady((msg) => {
      if (msg.ma_cuoc_hoi_thoai === contactId) {
        setMessages(prev => prev.map(m => 
          m.id === msg.ma_tin_nhan ? mapBackendMessage(msg) : m
        ));
      }
    });

    // Fetch initial messages and conversation info
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Lấy tin nhắn
        const msgs = await chatApi.getMessages(contactId);
        if (Array.isArray(msgs)) {
          setMessages(msgs.map(mapBackendMessage));
        }

        // Lấy thông tin hội thoại (từ danh sách hội thoại)
        const convs = await chatApi.getConversations();
        if (Array.isArray(convs)) {
          const currentConv = convs.find((c: any) => c.ma_cuoc_hoi_thoai === contactId);
          if (currentConv) {
            setConversationName(currentConv.ten_cuoc_hoi_thoai || "Conversation");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      unsubscribe();
      unsubscribeAiReady();
      // Optionally disconnect socket if needed, but usually better to keep it alive
    };
  }, [contactId, user]);


  // Check if this is a group chat
  const isGroupChat = contactId?.startsWith("group-");
  
  // Get group members if it's a group chat
  const groupMembers = (isGroupChat
    ? contactId
        ?.replace("group-", "")
        .split("-")
        .map((id) => allContacts.find((c) => c.id === id))
        .filter(Boolean)
    : []) || [];


  const contact = isGroupChat ? null : mockContact;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Filter suggestions based on input
    if (newMessage.trim().length > 1) {
      const filtered = suggestionDatabase.filter((s) =>
        newMessage.includes(s.keyword)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newMessage]);

  useEffect(() => {
    // Update reply suggestions based on last received message's AI suggestions
    const lastReceivedMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "other");
    
    if (lastReceivedMessage) {
      if (lastReceivedMessage.suggestions && lastReceivedMessage.suggestions.length > 0) {
        // Convert DB suggestions to replySuggestions format
        const convertedSuggestions = lastReceivedMessage.suggestions.map((s, idx) => ({
          id: `db-${lastReceivedMessage.id}-${idx}`,
          triggers: [],
          text: s.jpText,
          translation: s.viText,
          category: "提案",
          context: `関連性スコア: ${s.score}/3 | Điểm liên quan: ${s.score}/3`,
        }));
        setReplySuggestionsState(convertedSuggestions);
      } else {
        // Fallback to empty if no suggestions from AI yet
        setReplySuggestionsState([]);
      }
    }
  }, [messages]);

  const handleSelectSuggestion = (suggestion: typeof suggestionDatabase[0]) => {
    setNewMessage(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectReplySuggestion = (suggestion: any) => {
    setNewMessage(suggestion.text);
    inputRef.current?.focus();
  };


  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!contactId || !user) return;

    const messageData = {
      ma_cuoc_hoi_thoai: contactId,
      ma_nguoi_gui: user.id,
      noi_dung: newMessage,
      time: new Date().toISOString(),
    };

    // Gửi qua socket
    socketService.sendMessage(messageData);

    setNewMessage("");
    setSelectedFiles([]);
    setShowSuggestions(false);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="h-full flex bg-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app")}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {isGroupChat ? (
            // Group chat header
            <>
              <div className="relative flex">
                {groupMembers.slice(0, 3).map((member, index) => (
                  <Avatar
                    key={member?.id}
                    className={`w-10 h-10 border-2 border-white ${
                      index > 0 ? "-ml-3" : ""
                    }`}
                    style={{ zIndex: 3 - index }}
                  >
                    <AvatarImage src={member?.avatar} />
                    <AvatarFallback className="text-xs">
                      {member?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {groupMembers.length > 3 && (
                  <div className="w-10 h-10 -ml-3 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    +{groupMembers.length - 3}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4a9d9c]" />
                  <h2 className="font-medium">
                    {t("グループチャット", "Group Chat")}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {groupMembers.map((m) => m?.name).join(", ")} ({groupMembers.length} {t("メンバー", "thành viên")})
                </p>
              </div>

              <Button
                variant={showTranslation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className="bg-[#4a9d9c] hover:bg-[#3d8887] text-white"
              >
                <Languages className="w-4 h-4 mr-2" />
                {t("翻訳", "Dịch")}
              </Button>
            </>
          ) : (
            // 1-on-1 chat header
            <>
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact?.avatar} />
                  <AvatarFallback>{contact?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contact?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-medium truncate">{conversationName || "Conversation"}</h2>
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {language === "ja" ? "🇯🇵 日本" : "🇻🇳 Việt Nam"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  WorkBridge Member
                </p>
              </div>


              <Button
                variant={showTranslation ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className="bg-[#4a9d9c] hover:bg-[#3d8887] text-white"
              >
                <Languages className="w-4 h-4 mr-2" />
                {t("翻訳", "Dịch")}
              </Button>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === "me" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === "me"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  
                  {/* Translation shown by default */}
                  <p
                    className={`text-xs mt-2 pt-2 border-t ${
                      message.sender === "me"
                        ? "border-blue-400 text-blue-100"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {message.translatedText}
                  </p>

                  {/* Tone badge */}
                  {message.tone && (
                    <div className="mt-2">
                      <Badge
                        className={`text-xs ${
                          message.sender === "me"
                            ? "bg-blue-400 text-blue-900"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {message.tone === "trang trọng"
                          ? "正式 / Trang trọng"
                          : message.tone === "thân mật"
                          ? "親密 / Thân mật"
                          : "中立 / Trung lập"}
                      </Badge>
                    </div>
                  )}

                  {/* AI Analysis Loading Indicator */}
                  {!message.analysisReady && (
                    <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                      <span className="inline-block w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                      {message.sender === "me" ? "分析中..." : "Đang phân tích..."}
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={`rounded-lg overflow-hidden ${
                            message.sender === "me"
                              ? "bg-blue-700"
                              : "bg-gray-100"
                          }`}
                        >
                          {attachment.type.startsWith("image/") ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-w-full h-auto max-h-64 rounded-lg cursor-pointer"
                              onClick={() => window.open(attachment.url, "_blank")}
                            />
                          ) : (
                            <div
                              className={`flex items-center gap-2 p-2 cursor-pointer ${
                                message.sender === "me"
                                  ? "hover:bg-blue-800"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() => window.open(attachment.url, "_blank")}
                            >
                              <div className="shrink-0">
                                {getFileIcon(attachment.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {attachment.name}
                                </p>
                                <p className="text-xs opacity-75">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                              <Download className="w-4 h-4 shrink-0" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-1 px-2">
                  <span
                    className={`text-xs text-gray-500 ${
                      message.sender === "me" ? "order-2" : "order-1"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                  {message.intent && (
                    <div
                      className={`flex gap-1 ${
                        message.sender === "me" ? "order-1" : "order-2"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setSelectedMessageForIntent(message)}
                      >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {t("意図", "Ý định")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white relative">
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2">
              <div className="bg-white border border-[#4a9d9c] rounded-lg shadow-lg overflow-hidden max-h-[250px]">
                <div className="px-3 py-2 bg-[#e8f5f5] border-b border-[#6bb5b4] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-medium text-[#2d5958]">
                    💡 {t("提案", "Gợi ý")}
                  </span>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#e8f5f5] transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-[#4a9d9c] font-medium mt-0.5 shrink-0 bg-[#e8f5f5] px-2 py-0.5 rounded">
                          {translateCategory(suggestion.category, language)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {language === "ja" ? suggestion.text : suggestion.translation}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* File preview before sending */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("メッセージを入力", "Nhập tin nhắn") + "..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              ref={inputRef}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() && selectedFiles.length === 0}>
              <Send className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAttachFile}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t("メッセージは自動的に翻訳されます", "Tin nhắn sẽ được dịch tự động")}
          </p>
        </div>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Suggestion Sidebar */}
      <SuggestionSidebar
        suggestions={replySuggestionsState}
        onSelectSuggestion={handleSelectReplySuggestion}
        userNationality="vietnam"
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
      />

      {/* Dialogs */}
      {selectedMessageForIntent && (
        <MessageIntentDialog
          message={selectedMessageForIntent}
          onClose={() => setSelectedMessageForIntent(null)}
        />
      )}
    </div>
  );
}
