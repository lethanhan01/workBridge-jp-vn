# workBridge-jp-vn

Monorepo web nhằm kết nối thị trường việc làm và IT giữa Nhật Bản và Việt Nam. **Frontend** (`client/`) và **backend** (`server/`) phát triển độc lập; giao tiếp qua HTTP API, Socket.IO và (tuỳ tính năng) Supabase — **không import code xuyên thư mục** giữa hai workspace.

---

## Công nghệ chính

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | React 19, Vite 8, React Router 7, Socket.IO Client, Supabase JS (**anon key** trong browser) |
| Backend | Node.js, Express (**ESM**), Socket.IO, JWT; persistence qua **Supabase JS** (service role, chỉ trên server) |
| View backend | EJS (trang demo `/`) |
| Kiểm thử backend | Vitest + Sequelize + SQLite in-memory — đối chiếu schema với [`server/src/models/`](server/src/models/) |
| Ngôn ngữ | JavaScript |

Chi tiết từng workspace: [**client/README.md**](client/README.md) và [**server/README.md**](server/README.md).

---

## Cấu trúc thư mục (tóm tắt)

```text
workBridge-jp-vn/
├── client/                     # React + Vite
│   ├── src/
│   │   ├── App.jsx             # Router
│   │   ├── screens/             # Login, Signup, Dashboard, Chat, Dictionary, UserProfile
│   │   └── utils/               # socket.js, supabase.js, useSocket.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── server/                     # Express + Socket.IO
│   ├── bin/www                  # Entry: HTTP server + Socket
│   ├── src/
│   │   ├── app.js               # Express, middleware, mount `/api/*`
│   │   ├── socket.js            # Socket.IO + JWT handshake
│   │   ├── routes/              # API và logic route (auth mock, …)
│   │   ├── db/supabase.js       # Client Supabase phía server
│   │   ├── repositories/        # Thao tác bảng qua Supabase (ví dụ tinnhan)
│   │   ├── models/              # Sequelize factories — khớp schema DB & Vitest
│   │   ├── config/, utils/
│   ├── views/, public/          # EJS + static Express
│   ├── test/                    # Vitest
│   ├── package.json
│   └── README.md
│
├── CLAUDE.md                    # Gợi ý cho AI assistant trong repo
├── LICENSE
└── README.md                    # File này
```

---

## Luồng hoạt động

1. **Dev frontend:** Vite (`client/`), thường `http://localhost:5173`.
2. **Dev backend:** Express (`server/bin/www`), mặc định `http://localhost:3000` (biến `PORT`).
3. **Realtime:** Client kết nối Socket.IO tới cùng host/port backend; **JWT** gửi trong `handshake.auth` sau khi đăng nhập.
4. **Dữ liệu:** REST/query Supabase — anon key trên client (RLS), service role chỉ trong server (không lộ ra frontend).

---

## Chạy dự án (local)

### 1. Backend

```bash
cd server
cp .env.example .env    # Linux/macOS — Windows: copy tay
# Điền JWT_SECRET, SUPABASE_* khi cần persistence
npm install
npm run dev             # hoặc npm start
```

Backend: [`server/README.md`](server/README.md) (scripts, biến môi trường, API `/api/*`, Socket).

### 2. Frontend

```bash
cd client
cp .env.example .env    # điền VITE_SUPABASE_* và tuỳ chọn VITE_SOCKET_URL
npm install
npm run dev
```

Frontend: [`client/README.md`](client/README.md) (routes, Socket `connectSocket()`, Supabase browser).

Chạy **hai terminal** song song (server trước hoặc cùng lúc) để đủ API và Socket.

---

## Biến môi trường

- **Server:** `server/.env.example` — `PORT`, `JWT_SECRET`, `CLIENT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, …
- **Client:** `client/.env.example` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, tuỳ chọn `VITE_SOCKET_URL`.

Không commit file `.env` chứa secret.

---

## Kiểm thử backend

```bash
cd server
npm test
```

---

## Gợi ý onboarding

| Muốn làm… | Bắt đầu từ |
|-----------|------------|
| UI / route React | [`client/src/App.jsx`](client/src/App.jsx), [`client/README.md`](client/README.md) |
| API HTTP / middleware | [`server/src/app.js`](server/src/app.js), [`server/src/routes/`](server/src/routes/) |
| Realtime / lưu tin | [`server/src/socket.js`](server/src/socket.js), [`server/src/repositories/`](server/src/repositories/), [`client/src/utils/socket.js`](client/src/utils/socket.js) |
| Schema ORM / test model | [`server/src/models/`](server/src/models/), [`server/test/`](server/test/) |

Tham khảo thêm [`CLAUDE.md`](CLAUDE.md) cho convention trong repo.
