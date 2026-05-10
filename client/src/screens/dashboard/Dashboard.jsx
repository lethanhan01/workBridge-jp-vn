import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const contacts = [
  {
    id: 1,
    name: '田中健太',
    initial: '田',
    lang: 'JP',
    online: true,
    preview: 'プロジェクトの進捗について確認させてください',
    time: '2分前',
    unread: 2,
  },
  {
    id: 2,
    name: 'Nguyễn Văn An',
    initial: 'N',
    lang: 'VN',
    online: true,
    preview: '明日の会議の資料を送りました',
    time: '15分前',
    unread: 0,
  },
  {
    id: 3,
    name: '佐藤美咲',
    initial: '佐',
    lang: 'JP',
    online: true,
    preview: 'ありがとうございます！',
    time: '1時間前',
    unread: 0,
  },
  {
    id: 4,
    name: 'Trần Thị Mai',
    initial: 'T',
    lang: 'VN',
    online: true,
    preview: 'Đã hoàn thành báo cáo',
    time: '2時間前',
    unread: 1,
  },
  {
    id: 5,
    name: '山本隆',
    initial: '山',
    lang: 'JP',
    online: false,
    preview: 'お疲れ様です',
    time: '昨日',
    unread: 0,
  },
];

const Dashboard = ({ onSelectContact }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('chat');
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactClick = (contact) => {
    if (onSelectContact) onSelectContact(contact);
    navigate('/chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {sidebarOpen && (
        <div
          className="dashboard__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`dashboard__sidebar ${sidebarOpen ? 'dashboard__sidebar--open' : ''}`}>
        <div className="dashboard__brand">
          <h1 className="dashboard__brand-title">WorkBridge JP-VN</h1>
          <p className="dashboard__brand-subtitle">コミュニケーションツール</p>
        </div>

        <nav className="dashboard__nav">
          <button
            className={`dashboard__nav-item ${activeNav === 'chat' ? 'dashboard__nav-item--active' : ''}`}
            onClick={() => { setActiveNav('chat'); setSidebarOpen(false); }}
          >
            <ChatIcon />
            <span>チャット / Chat</span>
          </button>
          <button
            className={`dashboard__nav-item ${activeNav === 'dictionary' ? 'dashboard__nav-item--active' : ''}`}
            onClick={() => { setActiveNav('dictionary'); setSidebarOpen(false); navigate('/dictionary'); }}
          >
            <BookIcon />
            <span>辞書 / Từ điển</span>
          </button>
          <button
            className={`dashboard__nav-item ${activeNav === 'profile' ? 'dashboard__nav-item--active' : ''}`}
            onClick={() => { setActiveNav('profile'); setSidebarOpen(false); navigate('/profile'); }}
          >
            <PersonIcon />
            <span>プロフィール / Hồ sơ</span>
          </button>
        </nav>

        <div className="dashboard__footer">
          <button className="dashboard__logout" onClick={handleLogout}>
            <LogoutIcon />
            <span>ログアウト / Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard__main">
        <div className="dashboard__header">
          <div className="dashboard__header-left">
            <button
              className="dashboard__hamburger"
              onClick={() => setSidebarOpen(true)}
            >
              <HamburgerIcon />
            </button>
            <div>
              <h2 className="dashboard__title">チャット / Chat</h2>
              <p className="dashboard__subtitle">
                メッセージ一覧 / Danh sách tin nhắn
              </p>
            </div>
          </div>
          <button className="dashboard__compose">
            <ComposeIcon />
          </button>
        </div>

        <div className="dashboard__search">
          <SearchIcon />
          <input
            type="text"
            placeholder="検索 / Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dashboard__search-input"
          />
        </div>

        <div className="dashboard__contacts">
          {filtered.map((contact) => (
            <button
              key={contact.id}
              className="dashboard__contact"
              onClick={() => handleContactClick(contact)}
            >
              <div className="dashboard__avatar">
                <span className="dashboard__avatar-initial">
                  {contact.initial}
                </span>
                {contact.online && (
                  <span className="dashboard__avatar-online" />
                )}
              </div>

              <div className="dashboard__contact-content">
                <div className="dashboard__contact-header">
                  <span className="dashboard__contact-name">
                    {contact.name}
                  </span>
                  <LangBadge lang={contact.lang} />
                </div>
                <p className="dashboard__contact-preview">
                  {contact.preview}
                </p>
              </div>

              <div className="dashboard__contact-meta">
                <span className="dashboard__contact-time">{contact.time}</span>
                {contact.unread > 0 && (
                  <span className="dashboard__badge">{contact.unread}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

/* Dùng ảnh cờ thật từ flagcdn thay vì emoji cho đồng nhất mọi trình duyệt */
function LangBadge({ lang }) {
  if (lang === 'JP') {
    return (
      <span className="dashboard__lang-badge dashboard__lang-badge--jp">
        <img src="https://flagcdn.com/w20/jp.png" alt="JP" className="dashboard__flag-img" />
        JP
      </span>
    );
  }
  return (
    <span className="dashboard__lang-badge dashboard__lang-badge--vn">
      <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="dashboard__flag-img" />
      VN
    </span>
  );
}

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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
export default Dashboard;