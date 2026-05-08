import { Link } from "react-router-dom";
import "./style.css";

export const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Dữ liệu đăng nhập:", data);
    // Xử lý logic đăng nhập tại đây
  };

  return (
    <div className="login">
      {/* Phần tiêu đề nằm ngoài Card */}
      <div className="header-section">
        <h1>WorkBridge JP-VN</h1>
        <p>日本とベトナムをつなぐコミュニケーションツール</p>
        <p>Công cụ giao tiếp kết nối Nhật Bản và Việt Nam</p>
      </div>

      {/* Card đăng nhập */}
      <div className="card">
        <div className="card-title-group">
          <h2>ログイン / Đăng nhập</h2>
          <p>アカウントにログインしてください</p>
          <p>Đăng nhập vào tài khoản của bạn</p>
        </div>

        <div className="hint-box">
          <p className="hint-jp">💡 ヒント: 管理者としてログインするには、メールに「admin」を含めてください</p>
          <p className="hint-vn">Gợi ý: Để đăng nhập với quyền admin, sử dụng email có chứa "admin"</p>
        </div>

        {/* Sử dụng thẻ form để trình duyệt hỗ trợ gợi ý và lưu mật khẩu */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Group */}
          <div className="input-group">
            <label htmlFor="user-email">メールアドレス / Email</label>
            <div className="input-wrapper">
              <input 
                id="user-email"
                name="email" 
                type="email" 
                autoComplete="email" 
                placeholder="example@company.com" 
                required 
              />
              <img 
                className="input-icon" 
                src="https://c.animaapp.com/VPwPelXE/img/icon.svg" 
                alt="email icon" 
              />
            </div>
          </div>

          {/* Password Group */}
          <div className="input-group">
            <label htmlFor="user-password">パスワード / Mật khẩu</label>
            <div className="input-wrapper">
              <input 
                id="user-password"
                name="password"
                type="password" 
                autoComplete="current-password"
                placeholder="........" 
                required 
              />
              <img 
                className="input-icon" 
                src="https://c.animaapp.com/VPwPelXE/img/icon-1.svg" 
                alt="password icon" 
              />
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button type="submit" className="login-btn">
            ログイン / Đăng nhập
          </button>
        </form>

        {/* Footer Link */}
        <div className="card-footer">
          <p>アカウントをお持ちではありませんか？</p>
          <p>
            Chưa có tài khoản? <Link to="/signup" className="signup-link">登録 / Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
};