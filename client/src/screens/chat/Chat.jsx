import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

// Tái sử dụng Icon nguyên bản từ Dashboard, dùng 'currentColor'
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
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "chat", label: "チャット / Chat", icon: <ChatIcon /> },
  { id: "dictionary", label: "辞書 / Từ điển", icon: <BookIcon /> },
  { id: "profile", label: "プロフィール / Hồ sơ", icon: <PersonIcon /> },
];

const DEFAULT_MESSAGES = [
  {
    id: 1,
    sender: "other",
    textJP: "おはようございます！今日のミーティングは10時からですね。",
    textVN: "Chào buổi sáng! Cuộc họp hôm nay là từ 10 giờ đúng không?",
    time: "09:30",
  },
  {
    id: 2,
    sender: "me",
    textJP: "はい、そうです。資料の準備は完了しています。",
    textVN: "Vâng, đúng vậy. Tài liệu đã được chuẩn bị xong.",
    time: "09:32",
  },
  {
    id: 3,
    sender: "other",
    textJP: "ありがとうございます。助かります！",
    textVN: "Cảm ơn bạn. Bạn đã giúp tôi rất nhiều!",
    time: "09:33",
  },
];

const SUGGESTIONS = [
  {
    id: 1,
    labelJP: "返信",
    textJP: "どういたしまして。また何かありましたら、お気軽にお声がけください。",
    textVN: "Không có gì. Nếu có gì vui lòng cứ nhắn tin cho tôi.",
    note: "Phản hồi lời cảm ơn một cách lịch sự",
  },
  {
    id: 2,
    labelJP: "返信",
    textJP: "いえいえ、こちらこそありがとうございます。",
    textVN: "Không sao, tôi mới là người cần cảm ơn.",
    note: "Cách trả lời khiêm tốn theo văn hóa Nhật",
  },
];

export default function Chat({ contact, onBack }) {
  const [activeNav, setActiveNav] = useState("chat");
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [nextId, setNextId] = useState(4);

  // Fallback thông tin
  const contactName = contact?.name || "田中健太";
  const contactInitial = contact?.initial || "田";
  const contactLang = contact?.lang || "JP";
  const contactOnline = contact?.online ?? true;
  const contactDept = "営業部 / Phòng kinh doanh";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newMsg = {
      id: nextId,
      sender: "me",
      textJP: trimmed,
      textVN: "(Đang dịch...)",
      time: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setNextId((n) => n + 1);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-root">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="chat-mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR (Khớp Dashboard) ===== */}
      <aside className={`chat-sidebar${mobileSidebarOpen ? " open" : ""}`}>
        <div className="chat-sidebar-header">
          <h1 className="chat-sidebar-title">WorkBridge JP-VN</h1>
          <p className="chat-sidebar-subtitle">コミュニケーションツール</p>
        </div>

        <nav className="chat-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`chat-nav-link${activeNav === item.id ? " active" : ""}`}
              onClick={() => {
                setActiveNav(item.id);
                setMobileSidebarOpen(false);
                if (item.id === "chat" && onBack) onBack();
              }}
            >
              <span className="chat-nav-icon">{item.icon}</span>
              <span className="chat-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="chat-sidebar-footer">
          <button className="chat-logout-btn">
            <LogoutIcon />
            <span>ログアウト / Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CHAT ===== */}
      <main className="chat-main">
        {/* Chat Header */}
        <header className="chat-header">
          <button
            className="chat-back-btn"
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(true);
              } else if (onBack) {
                onBack();
              }
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
                  <img src="https://flagcdn.com/w20/jp.png" alt="JP" className="chat-flag-img" />
                  JP
                </span>
              ) : (
                <span className="chat-lang-badge chat-lang-badge--vn">
                  <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="chat-flag-img" />
                  VN
                </span>
              )}
            </div>
            <p className="chat-header-dept">{contactDept}</p>
          </div>

          <button className="chat-translate-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8l6 6"></path>
              <path d="M4 14l6-6 2-3"></path>
              <path d="M2 5h12"></path>
              <path d="M7 2h1"></path>
              <path d="M22 22l-5-10-5 10"></path>
              <path d="M14 18h6"></path>
            </svg>
            <span>翻訳 / Dịch</span>
          </button>
        </header>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((msg) =>
            msg.sender === "other" ? (
              <div key={msg.id} className="chat-msg-row chat-msg-row--other">
                <div className="chat-msg-bubble chat-msg-bubble--other">
                  <p className="chat-msg-text">{msg.textJP}</p>
                  <div className="chat-msg-divider" />
                  <p className="chat-msg-translation chat-msg-translation--other">{msg.textVN}</p>
                </div>
                <div className="chat-msg-meta">
                  <span className="chat-msg-time">{msg.time}</span>
                  <button className="chat-intent-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>意図 / Ý định</span>
                  </button>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="chat-msg-row chat-msg-row--me">
                <div className="chat-msg-bubble chat-msg-bubble--me">
                  <p className="chat-msg-text chat-msg-text--me">{msg.textJP}</p>
                  <div className="chat-msg-divider chat-msg-divider--me" />
                  <p className="chat-msg-translation chat-msg-translation--me">{msg.textVN}</p>
                </div>
                <div className="chat-msg-meta chat-msg-meta--me">
                  <button className="chat-intent-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
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
          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              placeholder="メッセージを入力... / Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`chat-send-btn${inputValue.trim() ? " active" : ""}`}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
            <button className="chat-attach-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
          </div>
          <p className="chat-auto-translate-note">
            メッセージは自動的に翻訳されます / Tin nhắn sẽ được dịch tự động
          </p>
        </div>
      </main>

      {/* ===== SUGGESTION SIDEBAR ===== */}
      <aside className={`chat-suggestion-sidebar${sidebarOpen ? " open" : ""}`}>
        <button
          className="chat-suggestion-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle suggestions"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: sidebarOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="chat-suggestion-header">
          <div className="chat-suggestion-header-title-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="18" x2="15" y2="18"></line>
              <line x1="10" y1="22" x2="14" y2="22"></line>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
            </svg>
            <h3 className="chat-suggestion-title">返信の提案 / Gợi ý phản hồi</h3>
          </div>
          <p className="chat-suggestion-subtitle">
            クリックして使用 / Click để sử dụng
          </p>
        </div>

        <div className="chat-suggestion-list">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              className="chat-suggestion-card"
              onClick={() => setInputValue(s.textJP)}
            >
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