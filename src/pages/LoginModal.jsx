import React, { useState } from "react";


const LoginModal = ({ isOpen, onClose, setLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const isEmailValid = email.includes(".com");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative h-[550px] w-full max-w-md bg-white rounded-2xl p-6 text-black shadow-xl overflow-hidden">
        {/* Nút quay lại / đóng */}
        <button
          onClick={() => (step === 2 ? setStep(1) : onClose())}
          className="absolute top-4 left-4 text-xl text-gray-400 hover:text-black transition"
        >
          {step === 2 ? "←" : "×"}
        </button>

        {/* Hiển thị chuyển bước mịt cách mượt */}
        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <h1 className="text-blue-700 font-bold text-3xl">☀️ AeroTech</h1>
                <h2 className="text-2xl font-semibold mt-2">Có trải nghiệm toàn diện</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Theo dõi giá vé, lập kế hoạch chuyến đi dễ dàng hơn và đặt vé nhanh hơn.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setStep(2)}
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
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-center mt-4 mb-6">
                Địa chỉ email của bạn là gì?
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-blue-500 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Địa chỉ email của bạn là gì?"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">PassWord</label>
                <div className="relative">
                <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"} 
                    className="w-full border border-blue-500 rounded-lg px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Mời nhập password" 
                />
                
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-xl"
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? "🫣" : "🧐"}
                </button>
                </div>
              </div>
                <button
                onClick={() => {
                    setLogin?.setLogined?.(true); 
                    setLogin?.setUser?.({
                      name: email.split("@")[0], 
                      email: email,
                    });
                    onClose();
                }}
                disabled={!isEmailValid}
                className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 
                    ${isEmailValid ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                Tiếp theo
                </button>

            </div>
          )}
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
