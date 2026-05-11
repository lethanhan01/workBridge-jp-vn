# Backend — workBridge (`server/`)

Phần backend của monorepo: HTTP API (Express), realtime (Socket.IO), và truy cập dữ liệu qua **Supabase JS** (REST). Tài liệu này giúp thành viên mới nắm cấu trúc, quy ước và chỗ cần chỉnh khi làm việc.

---

## Stack và quy ước chính

| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js |
| Module | **ESM** (`"type": "module"` trong [`package.json`](package.json) — dùng `import` / `export`) |
| HTTP | Express |
| View (tuỳ chọn) | EJS — chủ yếu trang demo |
| Realtime | Socket.IO |
| Auth (hiện tại) | JWT (`jsonwebtoken`); API đăng nhập vẫn dùng **mock in-memory** (sẽ thay bằng DB sau) |
| Dữ liệu runtime | **[@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)** |
| Schema / test ORM | Sequelize + SQLite in-memory trong Vitest — đối chiếu tên bảng/cột với Postgres trên Supabase |

Nguyên tắc: **router gọn**, logic đọc/ghi DB đặt trong [`src/repositories/`](src/repositories/) (hoặc `services/` khi team mở rộng), không nhét query dài trực tiếp trong handler route trừ khi prototype rất nhỏ.

---

## Yêu cầu và cài đặt lần đầu

1. **Node.js** (khuyến nghị LTS, ví dụ 20.x).
2. Trong thư mục `server/`:

```bash
npm install
```

3. Tạo file **`.env`** từ [`.env.example`](.env.example) và điền giá trị thật (ít nhất `JWT_SECRET`; Supabase nếu cần lưu tin qua API/Socket).

---

## Chạy dự án

| Mục đích | Lệnh |
|----------|------|
| Production-like | `npm start` → `node ./bin/www` |
| Dev có reload | `npm run dev` → nodemon |
| Test | `npm test` → Vitest một lần |
| Test watch | `npm run test:watch` |

**Entry HTTP:** [`bin/www`](bin/www) tạo `http.Server`, gắn [`src/app.js`](src/app.js) và gọi [`src/socket.js`](src/socket.js) để gắn Socket.IO cùng cổng.

Mặc định lắng nghe **`PORT`** hoặc cổng **3000**.

---

## Cấu trúc thư mục (onboarding)

```
server/
├── bin/
│   └── www                 # Entry Node: HTTP server + Socket.IO
├── src/
│   ├── app.js              # Cấu hình Express, middleware, mount router, xử lý lỗi
│   ├── socket.js           # Socket.IO: JWT handshake, join_room, send_message, …
│   ├── config/
│   │   └── authConstants.js    # JWT_SECRET (ưu tiên biến môi trường)
│   ├── db/
│   │   └── supabase.js     # Client Supabase singleton + cờ isSupabaseConfigured
│   ├── repositories/
│   │   └── tinnhanRepository.js  # Thao tác bảng `tinnhan` qua Supabase
│   ├── routes/
│   │   ├── index.js        # GET `/` — render EJS
│   │   ├── auth.js         # POST `/api/auth/login`, `/api/auth/signup` (mock user)
│   │   └── users.js        # Demo `/api/users`
│   ├── models/             # Factory Sequelize — khớp schema DB; dùng chủ yếu cho test
│   └── utils/
│       └── isUuid.js       # Tiện ích dùng chung (ví dụ Socket + persistence)
├── views/                  # Template EJS (`index`, `error`)
├── public/                 # Static (CSS, …)
├── test/
│   ├── helpers/
│   │   └── setupModels.js  # SQLite memory + load toàn bộ model Sequelize cho Vitest
│   └── models.test.js      # Kiểm tra model & association
├── vitest.config.js
├── package.json
├── .env.example
└── README.md               # File này
```

### Chi tiết từng nhóm

- **`bin/www`**  
  Chuẩn hóa cổng, bắt lỗi `EADDRINUSE`, log debug (`DEBUG=server:server` nếu cần).

- **`src/app.js`**  
  `dotenv` được load qua `import "dotenv/config"`. Đường dẫn `views` và `public` resolve từ thư mục `server/` (không phải trong `src/`).  
  Prefix **`/api/*`** dùng cho API JSON. Middleware lỗi: với request vào `/api` hoặc `Accept: application/json`, phản hồi **JSON**; còn lại render trang lỗi EJS.

- **`src/routes/`**  
  Mỗi file export `default` một `Router`. Mount trong `app.js` (ví dụ `/api/auth`, `/api/users`).

- **`src/db/supabase.js`**  
  Khởi tạo client từ `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Nếu thiếu biến, log cảnh báo và persistence qua Supabase sẽ không chạy.

- **`src/repositories/`**  
  Nơi gom các hàm `insert` / `select` / `update` theo bảng (RPC có thể thêm sau). Hiện có ví dụ [tinnhan](src/repositories/tinnhanRepository.js).

- **`src/socket.js`**  
  Bắt buộc JWT trong `handshake.auth.token`. Payload và event được mô tả trong comment đầu file. Lưu tin vào `tinnhan` khi có đủ UUID (`ma_cuoc_hoi_thoai`, `ma_nguoi_gui`) và Supabase đã cấu hình.

- **`src/models/*.js`**  
  Mỗi file export factory `(sequelize, DataTypes) => Model`, định nghĩa `tableName` và `associate`. Đây là **hợp đồng schema** với Postgres; **runtime business** nên đi qua Supabase repository, không khởi Sequelize trong `app.js` hiện tại.

- **`test/`**  
  Vitest + SQLite in-memory để đảm bảo model và quan hệ Sequelize không lệch so với ý định schema (foreign key, alias, …).

---

## Luồng xử lý tóm tắt

```text
Client HTTP  →  Express (app.js)  →  routes  →  (mock auth | repository Supabase)
Client WS    →  Socket.IO (socket.js)  →  JWT verify  →  (tinnhanRepository | chỉ emit)
```

---

## API HTTP (snapshot)

Cần kiểm tra chính xác handler trong [`src/routes/`](src/routes/) khi phát triển.

| Phương thức & đường dẫn | Mô tả ngắn |
|-------------------------|------------|
| `GET /` | Trang chủ EJS |
| `POST /api/auth/signup` | Đăng ký (mock, RAM) |
| `POST /api/auth/login` | Đăng nhập, trả JWT |
| `GET /api/users` | Demo placeholder |

**Lưu ý:** Auth persistence và hash mật khẩu là bước roadmap — không coi mock là nguồn sự thật production.

---

## Socket.IO (snapshot)

- **Kết nối:** `auth: { token: '<JWT>' }` (token đồng bộ với API login hiện tại).
- **Event:** xem comment trong [`src/socket.js`](src/socket.js) (`join_room`, `send_message`, payload để lưu DB, …).

Frontend tham chiếu: `client/src/utils/socket.js` — gọi `connectSocket()` sau login và đặt token vào `localStorage` trước khi connect.

---

## Biến môi trường

Đầy đủ mô tả trong [`.env.example`](.env.example). Ý chính:

- **`PORT`**: cổng HTTP/WS.
- **`JWT_SECRET`**: ký và verify JWT (và Socket); production **bắt buộc** đặt mạnh, không dùng giá trị mặc định trong code.
- **`CLIENT_URL`**: origin CORS cho Socket.IO (mặc định dev Vite `5173`).
- **`SUPABASE_URL`**, **`SUPABASE_SERVICE_ROLE_KEY`**: bật persistence REST; **service role** chỉ dùng server-side, không lộ ra client.
- **`DATABASE_URL`** (tuỳ chọn): phục vụ migration/CLI nếu team dùng sau này — không bắt buộc cho `@supabase/supabase-js`.

---

## Checklist cho thành viên mới

1. Clone monorepo, `cd server`, `npm install`.
2. Copy `.env.example` → `.env`, điền `JWT_SECRET` (và Supabase nếu làm phần có DB).
3. Chạy `npm run dev`, mở `http://localhost:3000/` kiểm tra trang chủ.
4. Đọc [`src/app.js`](src/app.js) và [`src/routes/auth.js`](src/routes/auth.js) để hiểu mock auth.
5. Đọc [`src/socket.js`](src/socket.js) trước khi sửa realtime hoặc payload tin nhắn.
6. Khi thêm bảng/query mới: ưu tiên thêm hàm trong `src/repositories/`, giữ tên bảng/cột khớp [`src/models/`](src/models/) và Supabase.
7. Chạy `npm test` trước khi merge thay đổi liên quan model/schema.

---

## Liên hệ monorepo

Frontend nằm ở [`../client/`](../client/) — API và Socket URL thường trỏ tới cổng backend (`3000` hoặc `PORT`).

Nếu chỉnh breaking API (đường dẫn, payload Socket), cập nhật đồng thời client và tài liệu ngắn trong PR để team frontend nắm được.
