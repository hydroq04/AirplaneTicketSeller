import React from "react";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="h-[550px] bg-white rounded-xl p-6 w-full max-w-md relative 
                animate-fadeIn shadow-xl transition-all duration-300 scale-100 text-black">
            {/* Nút đóng */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
            &times;
            </button>

            {/* Logo + Tiêu đề */}
            <div className="mb-6">
            <h1 className="text-blue-700 font-bold text-4xl">☀️AeroTech</h1>
            <h2 className="text-xl font-semibold mt-2 text-3xl">Có trải nghiệm toàn diện</h2>
            <p></p>
            <p className="text-sm text-gray-600 mt-1">
                Theo dõi giá vé, lập kế hoạch chuyến đi dễ dàng hơn và đặt vé nhanh hơn.
            </p>
            </div>

            {/* Các nút đăng nhập */}
            <div className="space-y-3">
            <button className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200">
                Tiếp tục bằng email
            </button>
            <button className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 flex justify-center items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" className="w-5 h-5" />
                Facebook
            </button>
            <button className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 flex justify-center items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" className="w-5 h-5" />
                Google
            </button>
            <button className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 flex justify-center items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/179/179309.png" className="w-5 h-5" />
                Apple
            </button>
            </div>

            {/* Checkbox + Điều khoản */}
            <div className="mt-4 text-xs text-gray-600">
            <label className="inline-flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-blue-600" />
                Nhớ tôi
            </label>
            <p className="mt-2">
                Bằng việc tiếp tục, bạn đồng ý với{" "}
                <a href="#" className="text-blue-600 underline">Điều khoản dịch vụ</a> và{" "}
                <a href="#" className="text-blue-600 underline">Chính sách quyền riêng tư</a>.
            </p>
            </div>
      </div>
    </div>
  );
};

export default LoginModal;
