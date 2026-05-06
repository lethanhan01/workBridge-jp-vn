# workBridge-jp-vn

`workBridge-jp-vn` là dự án web theo mô hình client/server, hướng tới việc kết nối thị trường việc làm và IT giữa Nhật Bản và Việt Nam. Repository hiện được tổ chức dạng monorepo, trong đó frontend và backend nằm ở hai thư mục riêng để dễ phát triển, kiểm thử và mở rộng độc lập.

## Công nghệ chính

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Template backend:** EJS
- **Ngôn ngữ:** JavaScript

## Cấu trúc thư mục

```text
workBridge-jp-vn/
├── client/                  # Ứng dụng frontend React chạy bằng Vite
│   ├── public/              # File tĩnh public, ví dụ icon và favicon
│   ├── src/                 # Mã nguồn chính của frontend
│   │   ├── assets/          # Hình ảnh, logo và tài nguyên dùng trong React
│   │   ├── App.jsx          # Component giao diện chính
│   │   ├── App.css          # Style riêng cho App.jsx
│   │   ├── index.css        # Style global cho frontend
│   │   └── main.jsx         # Điểm khởi động React, render App vào DOM
│   ├── index.html           # HTML gốc cho Vite
│   ├── package.json         # Script và dependencies của frontend
│   └── vite.config.js       # Cấu hình Vite và React plugin
│
├── server/                  # Ứng dụng backend Express
│   ├── bin/
│   │   └── www              # File khởi động HTTP server, mặc định port 3000
│   ├── public/              # File tĩnh do Express phục vụ
│   │   └── stylesheets/     # CSS dùng cho view EJS
│   ├── routes/              # Định nghĩa route backend
│   │   ├── index.js         # Route trang chủ `/`
│   │   └── users.js         # Route mẫu `/users`
│   ├── views/               # Template EJS render từ server
│   │   ├── index.ejs        # View trang chủ
│   │   └── error.ejs        # View hiển thị lỗi
│   ├── app.js               # Cấu hình Express app, middleware, routes, xử lý lỗi
│   └── package.json         # Script và dependencies của backend
│
├── .gitignore               # Danh sách file/thư mục không đưa lên Git
├── CLAUDE.md                # Ghi chú hướng dẫn cho AI coding assistant
├── LICENSE                  # Thông tin giấy phép
└── README.md                # Tài liệu tổng quan dự án
```

## Luồng hoạt động tổng quát

Frontend trong `client/` là ứng dụng React hiển thị giao diện người dùng. Khi phát triển local, Vite cung cấp dev server riêng để hỗ trợ hot reload.

Backend trong `server/` là ứng dụng Express. File `server/app.js` cấu hình middleware, static files, view engine EJS và gắn các route từ `server/routes/`. File `server/bin/www` tạo HTTP server và lắng nghe trên port `3000` nếu không cấu hình port khác.

Về lâu dài, frontend nên giao tiếp với backend thông qua API HTTP. Không import trực tiếp code từ `server/` vào `client/` hoặc ngược lại.

## Cách chạy dự án

### Chạy frontend

```bash
cd client
npm install
npm run dev
```

Sau đó mở URL mà Vite hiển thị trong terminal, thường là `http://localhost:5173`.

### Chạy backend

```bash
cd server
npm install
npm start
```

Backend mặc định chạy ở `http://localhost:3000`.

## Gợi ý cho người mới bắt đầu

Nếu muốn chỉnh giao diện React, bắt đầu từ `client/src/App.jsx` và các file CSS trong `client/src/`.

Nếu muốn thêm API hoặc route backend, bắt đầu từ `server/routes/`, sau đó kiểm tra route đã được gắn trong `server/app.js` chưa.

Nếu muốn thay đổi trang render bởi Express, chỉnh các file trong `server/views/`.
