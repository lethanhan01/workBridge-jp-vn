# Frontend — workBridge (`client/`)

Ứng dụng web React cho monorepo workBridge: đăng nhập/đăng ký, dashboard, chat realtime (Socket.IO), từ điển, hồ sơ. README này giúp thành viên mới chạy được dự án và biết chỗ sửa code.

---

## Stack

| Thành phần | Ghi chú |
|------------|---------|
| [React](https://react.dev/) 19 | UI |
| [Vite](https://vite.dev/) 8 | Dev server, build |
| [React Router](https://reactrouter.com/) 7 | Định tuyến (`createBrowserRouter`) |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | Chat realtime — kết nối backend Express |
| [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction) | Client browser với **anon key** (khác service role trên server) |
| [ESLint](https://eslint.org/) | `npm run lint` |
| React Compiler | Bật qua `@vitejs/plugin-react` + `@rolldown/plugin-babel` trong [`vite.config.js`](vite.config.js) — có thể làm chậm nhẹ dev/build; xem [React Compiler](https://react.dev/learn/react-compiler) |

---

## Yêu cầu và cài đặt

1. **Node.js** (khuyến nghị LTS, ví dụ 20.x).
2. Trong thư mục `client/`:

```bash
npm install
```

3. Tạo **`.env`** từ [`.env.example`](.env.example) và điền biến `VITE_*` (Supabase anon key dùng cho các màn gọi Supabase trực tiếp từ trình duyệt).

---

## Biến môi trường (`VITE_*`)

Vite chỉ đưa các biến có tiền tố **`VITE_`** vào bundle (truy cập qua `import.meta.env`).

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `VITE_SUPABASE_URL` | Nếu dùng [`src/utils/supabase.js`](src/utils/supabase.js) | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Nếu dùng Supabase từ FE | **Public anon key** — không dùng service role |
| `VITE_SOCKET_URL` | Không | URL backend Socket.IO + HTTP API; mặc định `http://localhost:3000` trong [`src/utils/socket.js`](src/utils/socket.js) |

**An toàn:** không commit file `.env`; chỉ commit `.env.example`.

---

## Scripts

| Lệnh | Mục đích |
|------|-----------|
| `npm run dev` | Dev server Vite (thường cổng **5173**) |
| `npm run build` | Build production → `dist/` |
| `npm run preview` | Xem thử bản build cục bộ |
| `npm run lint` | Chạy ESLint |

---

## Chạy cùng backend

Frontend và backend là hai process độc lập:

1. Terminal 1 — trong [`../server/`](../server/): `npm run dev` hoặc `npm start` (mặc định cổng **3000**).
2. Terminal 2 — trong `client/`: `npm run dev`.

Đảm bảo URL API và Socket trùng cổng backend (hoặc đặt `VITE_SOCKET_URL` khi backend chạy host/port khác).

---

## Cấu trúc thư mục

```
client/
├── index.html
├── vite.config.js
├── eslint.config.js
├── public/                 # Static gốc (ví dụ icons.svg)
├── src/
│   ├── index.jsx           # mount React
│   ├── App.jsx             # Định nghĩa router và các route
│   ├── utils/
│   │   ├── socket.js       # Singleton Socket.IO + connectSocket / disconnectSocket
│   │   ├── supabase.js     # createClient Supabase (anon)
│   │   └── useSocket.js    # Hook chat (messages, gửi tin) — nối với socket.js
│   └── screens/            # Theo màn hình / tính năng
│       ├── Login/
│       ├── Signup/
│       ├── dashboard/
│       ├── chat/
│       ├── Dictionary/
│       └── UserProfile/
├── .env.example
├── package.json
└── README.md
```

### Định tuyến

Cấu hình trong [`src/App.jsx`](src/App.jsx):

| Đường dẫn | Màn hình |
|-----------|-----------|
| `/` | Redirect → `/login` |
| `/login` | Đăng nhập |
| `/signup` | Đăng ký |
| `/dashboard` | Dashboard |
| `/chat` | Chat |
| `/dictionary` | Từ điển |
| `/profile` | Hồ sơ |
| `*` | Fallback → `/login` |

Khi thêm route mới: khai báo object trong `createBrowserRouter`, tạo thư mục dưới `screens/` và export component.

---

## Gọi API backend (HTTP)

Các màn như Login/Signup đang `fetch` trực tiếp URL backend (ví dụ `http://localhost:3000/api/auth/...`). Để đồng nhất môi trường:

- Có thể giữ URL đầy đủ, hoặc
- Dùng biến `import.meta.env.VITE_API_BASE_URL` (tự thêm vào `.env` / `.env.example` nếu team chuẩn hóa) và nối path `/api/...`.

Chi tiết endpoint và mock auth: xem [`../server/README.md`](../server/README.md).

---

## Socket.IO (chat)

File [`src/utils/socket.js`](src/utils/socket.js):

- **`autoConnect: false`** — chỉ kết nối sau khi gọi **`connectSocket()`** (nên gọi sau login thành công).
- Trước khi `connect()`, gán **`socket.auth = { token: localStorage.getItem('token') }`** — backend **bắt buộc JWT** khi handshake.
- Sau `connect`, handler `join_room` gửi `userId` lấy từ object user trong `localStorage` (đồng bộ với payload login).

Khi logout: gọi **`disconnectSocket()`** để giải phóng kết nối.

Payload realtime (ví dụ lưu tin vào DB): xem comment và contract trong [`../server/src/socket.js`](../server/src/socket.js).

---

## Supabase từ trình duyệt

[`src/utils/supabase.js`](src/utils/supabase.js) dùng **anon key**. Row Level Security (RLS) trên Supabase phải được cấu hình phù hợp — không thay anon bằng service role trên client.

---

## ESLint

Cấu hình phẳng trong [`eslint.config.js`](eslint.config.js). Trước khi commit lớn, chạy:

```bash
npm run lint
```

(Nếu sau này chuyển sang TypeScript, cân nhắc template TS + `typescript-eslint` như gợi ý của Vite.)

---

## Checklist thành viên mới

1. `cd client && npm install`
2. Copy `.env.example` → `.env`, điền `VITE_SUPABASE_*` (và `VITE_SOCKET_URL` nếu cần)
3. Khởi chạy backend `../server` rồi `npm run dev` trong `client`
4. Đăng nhập thử — kiểm tra `localStorage` có `token` và `user` trước khi vào Chat / Socket
5. Đọc [`App.jsx`](src/App.jsx) và thư mục `screens/` liên quan task của bạn
6. Đọc [`../server/README.md`](../server/README.md) để nắm API prefix `/api`, CORS và Socket auth

---

## Monorepo

- Backend: [`../server/`](../server/)
- Hai repo không import code trực tiếp qua đường dẫn file — chỉ giao tiếp qua HTTP, Socket và (tuỳ chọn) Supabase.
