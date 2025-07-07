import React, { useState } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const LoginModal = ({ isOpen, onClose, setLogin }) => {
  const [step, setStep] = useState(1); // 1 | 2
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [bankInfo, setBankInfo] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setCccd] = useState("");

  const [error, setError] = useState("");
  const [userList, setUserList] = useState([
    {
      email: "alice@example.com",
      password: "123456",
      name: "Alice",
      age: "25",
      dob: "2000-01-01",
      address: "Hà Nội",
      bankInfo: "VCB - 123456789",
      role: "user"
    },
    {
      email: "bob@example.com",
      password: "abcdef",
      name: "Bob",
      age: "30",
      dob: "1995-01-01",
      address: "TP.HCM",
      bankInfo: "ACB - 987654321",
      role: "user"
    },
    {
      email: "duyphuc2425@gmail.com",
      password: "phuc",
      name: "Nguyễn Văn A",
      age: "223",
      dob: "2025-01-31",
      address: "Tây Ninh",
      bankInfo: "VCB-1231231231",
      role: "admin"
    }
  ]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isOpen) return null;

  const switchMode = () => {
    setMode("register");
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!email || !password || !confirmPassword || !name || !age || !dob || !address || !bankInfo || !phone || !cccd) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu không khớp.");
        return;
      }

      const emailExists = userList.some(user => user.email === email);
      if (emailExists) {
        setError("Email đã tồn tại.");
        return;
      }

    const newUser = { 
      email, 
      password, 
      firstName: name, 
      lastName: "",
      age, 
      dob, 
      address, 
      bankInfo,
      phone,
      cccd
    };

    fetch(`${API_Url}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Đăng ký thành công, ID:', data.userId);
          newUser._id = data.userId; // lưu thêm ID từ server
          // setUserList(prevList => [...prevList, newUser]);
          setLogin?.setLogined?.(true);
          setLogin?.setUser?.(newUser);
          onClose();
        } else {
          setError("Lỗi đăng ký: " + data.message);
        }
      })
      .catch(error => {
        console.error('Lỗi mạng hoặc server:', error);
        setError("Không thể kết nối tới server.");
      });
      // setLogin?.setLogined?.(true);
      // setLogin?.setUser?.(newUser);
      // onClose(); // không reset gì cả cho user
    } else {
      // const foundUser = userList.find(user => user.email === email && user.password === password);
      // if (!foundUser) {
      //   setError("Không tìm thấy tài khoản. Vui lòng đăng ký.");
      //   return;
      // }
      fetch (`${API_Url}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })
      .then(res => res.json())
      .then(data=> {
        if (!data.success){
          setError("Email hoặc mật khẩu không đúng.")
          return
        }
        const foundUser = data.user
        console.log(foundUser)
        setLogin?.setLogined?.(true);
        setLogin?.setUser?.(foundUser);
        if (foundUser.role === "admin") {
            setLogin?.Homeadmin?.();
        }
      onClose();
      })
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-2xl text-black shadow-xl overflow-hidden max-h-[90vh]">
        <div className="p-6 overflow-y-auto max-h-[90vh] pb-16">
          <button
            onClick={() => (step === 2 ? setStep(1) : onClose())}
            className="absolute top-4 left-4 text-xl text-gray-400 hover:text-black transition"
          >
            {step === 2 ? "←" : "×"}
          </button>

          <div className="transition-all duration-500 ease-in-out">
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <h1 className="text-blue-700 font-bold text-3xl">☀️ AeroTech</h1>
                  <h2 className="text-2xl font-semibold mt-2">Chào mừng bạn</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Hãy đăng nhập hoặc đăng ký để tiếp tục.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setStep(2);
                      setMode("login");
                    }}
                    className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Tiếp tục bằng email
                  </button>
                  <LoginButton icon="https://cdn-icons-png.flaticon.com/512/145/145802.png" text="Facebook" />
                  <LoginButton icon="https://cdn-icons-png.flaticon.com/512/281/281764.png" text="Google" />
                  <LoginButton icon="https://cdn-icons-png.flaticon.com/512/179/179309.png" text="Apple" />
                  <div className="mt-4 text-xs text-gray-600">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="accent-blue-600" />
                      Nhớ tôi
                    </label>
                    <p className="mt-2">
                      Bằng việc tiếp tục, bạn đồng ý với{" "}
                      <a href="#" className="text-blue-600 underline hover:text-blue-800">Điều khoản dịch vụ</a> và{" "}
                      <a href="#" className="text-blue-600 underline hover:text-blue-800">Chính sách quyền riêng tư</a>.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-600 mt-2">
                  Chưa có tài khoản?{" "}
                  <a onClick={switchMode} className="text-blue-600 hover:underline cursor-pointer">
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="animate-fadeIn space-y-3">
                <h2 className="text-xl font-bold text-center mt-2 mb-2">
                  {mode === "login" ? "Đăng nhập bằng Email" : "Đăng ký tài khoản mới"}
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tên</label>
                      <input value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm" placeholder="Tên của bạn" />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Tuổi</label>
                        <input value={age} onChange={(e) => setAge(e.target.value)} type="number"
                          className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm" placeholder="VD: 22" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                        <input value={dob} onChange={(e) => setDob(e.target.value)} type="date"
                          className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                      <input value={address} onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm" placeholder="Địa chỉ liên hệ" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Thông tin ngân hàng</label>
                      <textarea value={bankInfo} onChange={(e) => setBankInfo(e.target.value)}
                        className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm" placeholder="Ngân hàng, STK, chi nhánh..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm"
                        placeholder="Số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CCCD</label>
                      <input
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                        className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm"
                        placeholder="CCCD (12 số)"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-blue-500 rounded-lg px-4 py-2 pr-10 text-sm"
                      placeholder="Mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-xl"
                    >
                      {showPassword ? "🫣" : "🧐"}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isEmailValid}
                  className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isEmailValid
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>

                {error && (
                  <p className="text-sm text-red-600 font-medium text-center mt-1">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginButton = ({ text, icon }) => (
  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
    {icon && <img src={icon} alt="" className="w-5 h-5" />}
    <span className="font-medium">{text}</span>
  </button>
);

export default LoginModal;
