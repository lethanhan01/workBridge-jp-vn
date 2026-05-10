import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../utils/useSocket";
import "./Chat.css";

// ===== ICONS =====
function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function ChevronRightIcon({ flipped }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`chat-suggestion-toggle-icon${flipped ? " flipped" : ""}`}
    >
      {/* Mặc định trỏ sang trái (‹), khi open xoay 180° thành phải (›) */}
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ===== DATA =====
const NAV_ITEMS = [
  { id: "chat",       label: "チャット / Chat",        icon: <ChatIcon />,   path: "/chat" },
  { id: "dictionary", label: "辞書 / Từ điển",          icon: <BookIcon />,   path: "/dictionary" },
  { id: "profile",    label: "プロフィール / Hồ sơ",    icon: <PersonIcon />, path: "/profile" },
];

const DEFAULT_MESSAGES = [
  { id: 1, sender: "other", textJP: "おはようございます！今日のミーティングは10時からですね。", textVN: "Chào buổi sáng! Cuộc họp hôm nay là từ 10 giờ đúng không?", time: "09:30" },
  { id: 2, sender: "me",    textJP: "はい、そうです。資料の準備は完了しています。",              textVN: "Vâng, đúng vậy. Tài liệu đã được chuẩn bị xong.",          time: "09:32" },
  { id: 3, sender: "other", textJP: "ありがとうございます。助かります！",                       textVN: "Cảm ơn bạn. Bạn đã giúp tôi rất nhiều!",                  time: "09:33" },
];

const SUGGESTIONS = [
  { id: 1, labelJP: "返信", textJP: "どういたしまして。また何かありましたら、お気軽にお声がけください。", textVN: "Không có gì. Nếu có gì vui lòng cứ nhắn tin cho tôi.", note: "Phản hồi lời cảm ơn một cách lịch sự" },
  { id: 2, labelJP: "返信", textJP: "いえいえ、こちらこそありがとうございます。",                       textVN: "Không sao, tôi mới là người cần cảm ơn.",               note: "Cách trả lời khiêm tốn theo văn hóa Nhật" },
];

// ===== COMPONENT =====
export default function Chat({ contact, onBack }) {
  const navigate = useNavigate();

  // --- Lấy thông tin user hiện tại từ localStorage ---
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id || null;

  // --- Socket.IO hook ---
  // TODO: Thay DEFAULT_MESSAGES bằng lịch sử chat fetch từ API khi có BE
  // TODO: Thay contactId bằng contact?.id thật khi có data từ Dashboard
  const contactId = contact?.id || null;
  const { messages, setMessages, sendMessage, isConnected } = useSocket(
    currentUserId,
    contactId,
    DEFAULT_MESSAGES   // Dùng tạm tin nhắn mẫu; xóa khi kết nối DB thật
  );

  const [inputValue, setInputValue]           = useState("");
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles]     = useState([]);   // {id, file, previewUrl}
  const [nextId, setNextId]                   = useState(4);
  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);

  const contactName    = contact?.name    || "田中健太";
  const contactInitial = contact?.initial || "田";
  const contactLang    = contact?.lang    || "JP";
  const contactOnline  = contact?.online  ?? true;
  const contactDept    = "営業部 / Phòng kinh doanh";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup preview URLs khi unmount hoặc file thay đổi
  useEffect(() => {
    return () => {
      attachedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [attachedFiles]);

  // ---- Handlers ----
  const handleGoBack = () => {
    if (onBack) onBack();
    else navigate("/dashboard");
  };

  const handleNavItem = (item) => {
    setMobileSidebarOpen(false);
    if (item.id === "chat") return; // already here
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed && attachedFiles.length === 0) return;

    // --- Gửi qua Socket.IO khi đã có userId và contactId thật ---
    // TODO: Uncomment khi BE đã setup và user có id thật
    // if (currentUserId && contactId && trimmed) {
    //   sendMessage(trimmed);
    // }

    // Tạm thời vẫn dùng local state để UI hoạt động mà không cần BE
    const newMsg = {
      id: nextId,
      sender: "me",
      textJP: trimmed || "",
      textVN: trimmed ? "(Đang dịch...)" : "",
      time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false }),
      files: attachedFiles.map(f => ({ name: f.file.name, size: f.file.size, previewUrl: f.previewUrl, type: f.file.type })),
    };

    setMessages(prev => [...prev, newMsg]);
    setNextId(n => n + 1);
    setInputValue("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    const newFiles = selected.map((file, i) => ({
      id: Date.now() + i,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    // Reset input để có thể chọn cùng file lại
    e.target.value = "";
  };

  const handleRemoveFile = (id) => {
    setAttachedFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const canSend = inputValue.trim() || attachedFiles.length > 0;

  return (
    <div className="chat-root">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="chat-mobile-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className={`chat-sidebar${mobileSidebarOpen ? " open" : ""}`}>
        <div className="chat-sidebar-header">
          <h1 className="chat-sidebar-title">WorkBridge JP-VN</h1>
          <p className="chat-sidebar-subtitle">コミュニケーションツール</p>
        </div>

        <nav className="chat-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`chat-nav-link${item.id === "chat" ? " active" : ""}`}
              onClick={() => handleNavItem(item)}
            >
              <span className="chat-nav-icon">{item.icon}</span>
              <span className="chat-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="chat-sidebar-footer">
          <button className="chat-logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            <span>ログアウト / Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CHAT ===== */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          {/* Back / hamburger button */}
          <button
            className="chat-back-btn"
            onClick={() => {
              if (window.innerWidth < 768) setMobileSidebarOpen(true);
              else handleGoBack();
            }}
            aria-label="Back or menu"
          >
            {window.innerWidth < 768 ? <HamburgerIcon /> : <ArrowLeftIcon />}
          </button>

          <div className="chat-header-avatar">
            <div className="chat-avatar-circle">{contactInitial}</div>
            {contactOnline && <span className="chat-online-dot" />}
          </div>

          <div className="chat-header-info">
            <div className="chat-header-name-row">
              <span className="chat-header-name">{contactName}</span>
              {contactLang === "JP" ? (
                <span className="chat-lang-badge chat-lang-badge--jp">
                  <img src="https://flagcdn.com/w20/jp.png" alt="JP" className="chat-flag-img" />JP
                </span>
              ) : (
                <span className="chat-lang-badge chat-lang-badge--vn">
                  <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="chat-flag-img" />VN
                </span>
              )}
            </div>
            <p className="chat-header-dept">{contactDept}</p>
          </div>

          <button className="chat-translate-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" />
              <path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
            </svg>
            <span>翻訳 / Dịch</span>
          </button>
        </header>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) =>
            msg.sender === "other" ? (
              <div key={msg.id} className="chat-msg-row chat-msg-row--other">
                <div className="chat-msg-bubble chat-msg-bubble--other">
                  {msg.textJP && <p className="chat-msg-text">{msg.textJP}</p>}
                  {msg.files?.map((f, i) => (
                    <div key={i} className="chat-file-preview">
                      {f.previewUrl ? (
                        <img src={f.previewUrl} alt={f.name} className="chat-file-img" />
                      ) : (
                        <div className="chat-file-chip">
                          <FileIcon />
                          <span>{f.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {msg.textVN && (
                    <>
                      <div className="chat-msg-divider" />
                      <p className="chat-msg-translation chat-msg-translation--other">{msg.textVN}</p>
                    </>
                  )}
                </div>
                <div className="chat-msg-meta">
                  <span className="chat-msg-time">{msg.time}</span>
                  <button className="chat-intent-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span>意図 / Ý định</span>
                  </button>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="chat-msg-row chat-msg-row--me">
                <div className="chat-msg-bubble chat-msg-bubble--me">
                  {msg.textJP && <p className="chat-msg-text chat-msg-text--me">{msg.textJP}</p>}
                  {msg.files?.map((f, i) => (
                    <div key={i} className="chat-file-preview">
                      {f.previewUrl ? (
                        <img src={f.previewUrl} alt={f.name} className="chat-file-img" />
                      ) : (
                        <div className="chat-file-chip chat-file-chip--me">
                          <FileIcon />
                          <span>{f.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {msg.textVN && (
                    <>
                      <div className="chat-msg-divider chat-msg-divider--me" />
                      <p className="chat-msg-translation chat-msg-translation--me">{msg.textVN}</p>
                    </>
                  )}
                </div>
                <div className="chat-msg-meta chat-msg-meta--me">
                  <button className="chat-intent-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span>意図 / Ý định</span>
                  </button>
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          {/* File previews strip */}
          {attachedFiles.length > 0 && (
            <div className="chat-attach-strip">
              {attachedFiles.map(f => (
                <div key={f.id} className="chat-attach-item">
                  {f.previewUrl ? (
                    <img src={f.previewUrl} alt={f.file.name} className="chat-attach-thumb" />
                  ) : (
                    <div className="chat-attach-file">
                      <FileIcon />
                      <span className="chat-attach-name">{f.file.name}</span>
                    </div>
                  )}
                  <button
                    className="chat-attach-remove"
                    onClick={() => handleRemoveFile(f.id)}
                    aria-label="Remove file"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            {/* Paperclip / attach button */}
            <button
              className="chat-attach-btn"
              onClick={handleAttachClick}
              aria-label="Attach file"
              title="Đính kèm file"
            >
              <PaperclipIcon />
            </button>

            <input
              className="chat-input"
              type="text"
              placeholder="メッセージを入力... / Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              className={`chat-send-btn${canSend ? " active" : ""}`}
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
          <p className="chat-auto-translate-note">
            メッセージは自動的に翻訳されます / Tin nhắn sẽ được dịch tự động
          </p>
        </div>
      </main>

      {/* ===== RIGHT SUGGESTION SIDEBAR ===== */}
      <aside className={`chat-suggestion-sidebar${sidebarOpen ? " open" : ""}`}>
        {/* Toggle button – slides in/out with the sidebar */}
        <button
          className="chat-suggestion-toggle"
          onClick={() => setSidebarOpen(v => !v)}
          aria-label="Toggle suggestions"
        >
          <ChevronRightIcon flipped={sidebarOpen} />
        </button>

        <div className="chat-suggestion-header">
          <div className="chat-suggestion-header-title-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
            <h3 className="chat-suggestion-title">返信の提案 / Gợi ý phản hồi</h3>
          </div>
          <p className="chat-suggestion-subtitle">クリックして使用 / Click để sử dụng</p>
        </div>

        <div className="chat-suggestion-list">
          {SUGGESTIONS.map(s => (
            <button key={s.id} className="chat-suggestion-card" onClick={() => setInputValue(s.textJP)}>
              <div className="chat-suggestion-card-top">
                <span className="chat-suggestion-label">{s.labelJP}</span>
              </div>
              <p className="chat-suggestion-text-jp">{s.textJP}</p>
              <p className="chat-suggestion-text-vn">{s.textVN}</p>
              <p className="chat-suggestion-note">{s.note}</p>
            </button>
          ))}
        </div>

        <div className="chat-cultural-note">
          <p>💡 提案は文化的に適切な表現です</p>
          <p>Gợi ý sử dụng cách diễn đạt phù hợp văn hóa</p>
        </div>
      </aside>
    </div>
  );
}