import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

export const Signup = () => {
  const navigate = useNavigate();
  // State để lưu trữ thông báo lỗi (Mục 11 - 17)
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    let newErrors = {};

    // Kiểm tra Tên (Mục 1 & 11)
    if (!data.name.trim()) {
      newErrors.name = "名前を入力してください / Vui lòng nhập tên";
    }

    // Kiểm tra Email (Mục 2 & 12)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = "メールアドレスを入力してください / Vui lòng nhập email";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "メールアドレスの形式が正しくありません / Định dạng email không hợp lệ";
    }

    // Kiểm tra Quốc tịch (Mục 3 & 13)
    if (!data.nationality) {
      newErrors.nationality = "国籍を選択してください / Vui lòng chọn quốc tịch";
    }

    // Kiểm tra Giới tính (Mục 4 & 14)
    if (!data.gender) {
      newErrors.gender = "性別を選択してください / Vui lòng chọn giới tính";
    }

    // Kiểm tra Phòng ban (Mục 5 & 15)
    if (!data.department.trim()) {
      newErrors.department = "部署を入力してください / Vui lòng nhập phòng ban";
    }

    // Kiểm tra Mật khẩu (Mục 6 & 16)
    if (!data.password) {
      newErrors.password = "パスワードを入力してください / Vui lòng nhập mật khẩu";
    } else if (data.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください / Mật khẩu phải ít nhất 8 ký tự";
    }

    // Kiểm tra Xác nhận mật khẩu (Mục 7 & 17)
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "パスワードを再入力してください / Vui lòng xác nhận mật khẩu";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません / Xác nhận mật khẩu không khớp";
    }

    return newErrors;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const validationErrors = validate(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Hiển thị lỗi nếu có (Mục 10)
    } else {
      setErrors({});
      console.log("Đăng ký thành công:", data);
      alert("Đăng ký thành công! / 登録が完了しました！");
      navigate("/login"); // Chuyển hướng sang Login (Mục 8)
    }
  };

  return (
    <div className="signup-page">
      <header className="header-section">
        <h1>WorkBridge JP-VN</h1>
        <p>日本とベトナムをつなぐコミュニケーションツール</p>
        <p>Công cụ giao tiếp kết nối Nhật Bản và Việt Nam</p>
      </header>

      <div className="card">
        <div className="card-title-group">
          <h2>アカウント登録 / Đăng ký tài khoản</h2>
          <p>新しいアカウントを作成してください</p>
          <p>Tạo tài khoản mới</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup} noValidate>
          {/* Tên */}
          <div className="input-group">
            <label>名前 / Tên</label>
            <div className="input-wrapper">
              <input name="name" type="text" placeholder="山田太郎 / Nguyễn Văn A" className={errors.name ? "input-error" : ""} />
              <img className="input-icon" src="https://c.animaapp.com/VPwPelXE/img/icon-2.svg" alt="" />
            </div>
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="input-group">
            <label>メールアドレス / Email</label>
            <div className="input-wrapper">
              <input name="email" type="email" placeholder="example@company.com" className={errors.email ? "input-error" : ""} />
              <img className="input-icon" src="https://c.animaapp.com/VPwPelXE/img/icon-3.svg" alt="" />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Quốc tịch */}
          <div className="input-group">
            <label>国籍 / Quốc tịch</label>
            <div className="input-wrapper">
              <select name="nationality" className={errors.nationality ? "input-error" : ""}>
                <option value="">選択してください / Chọn</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Japan">Japan</option>
              </select>
              <img className="input-icon-right" src="https://c.animaapp.com/VPwPelXE/img/icon-5.svg" alt="" />
            </div>
            {errors.nationality && <span className="error-msg">{errors.nationality}</span>}
          </div>

          {/* Giới tính */}
          <div className="input-group">
            <label>性別 / Giới tính</label>
            <div className="input-wrapper">
              <select name="gender" className={errors.gender ? "input-error" : ""}>
                <option value="">選択してください / Chọn</option>
                <option value="Nam">Nam / 男性</option>
                <option value="Nu">Nữ / 女性</option>
              </select>
              <img className="input-icon-right" src="https://c.animaapp.com/VPwPelXE/img/icon-5.svg" alt="" />
            </div>
            {errors.gender && <span className="error-msg">{errors.gender}</span>}
          </div>

          {/* Phòng ban */}
          <div className="input-group">
            <label>部署 / Phòng ban</label>
            <div className="input-wrapper">
              <input name="department" type="text" placeholder="営業部 / Phòng kinh doanh" className={errors.department ? "input-error" : ""} />
              <img className="input-icon" src="https://c.animaapp.com/VPwPelXE/img/icon-6.svg" alt="" />
            </div>
            {errors.department && <span className="error-msg">{errors.department}</span>}
          </div>

          {/* Mật khẩu */}
          <div className="input-group">
            <label>パスワード / Mật khẩu</label>
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="........" className={errors.password ? "input-error" : ""} />
              <img className="input-icon" src="https://c.animaapp.com/VPwPelXE/img/icon-7.svg" alt="" />
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="input-group">
            <label>パスワード確認 / Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <input name="confirmPassword" type="password" placeholder="........" className={errors.confirmPassword ? "input-error" : ""} />
              <img className="input-icon" src="https://c.animaapp.com/VPwPelXE/img/icon-8.svg" alt="" />
            </div>
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="signup-btn">登録 / Đăng ký</button>
        </form>

        <div className="card-footer">
          <p>すでにアカウントをお持ちですか？</p>
          <p>Đã có tài khoản? <Link to="/login" className="login-link">ログイン / Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};