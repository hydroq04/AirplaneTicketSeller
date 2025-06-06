import React, { useEffect, useRef, useState } from "react";

const AccountInfoPopup = ({ user, onClose, onLogout, ticketCount }) => {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        hideWithAnimation();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hideWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  return (
    <div className="relative z-50">
      <div
        ref={ref}
        className={`absolute top-4 right-0 w-72 bg-white p-5 rounded-2xl shadow-2xl transition-all duration-200 ease-out text-black
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Mũi nhọn đặt bên trong để cùng animate */}
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 z-0" />

        {/* Nội dung tài khoản */}
        <div className="flex items-center gap-3 mb-4 z-10 relative">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "👤"}
          </div>
          <div>
            <p className="text-base font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-800 mb-4 flex items-center gap-2">
          🧾 <span>Bạn đã đặt <strong>{ticketCount}</strong> vé</span>
        </div>

        <button
          onClick={() => {
            hideWithAnimation();
            setTimeout(() => onLogout?.(), 200);
          }}
          className="w-full py-2 text-center rounded-lg text-red-600 hover:bg-red-50 transition font-medium text-sm"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AccountInfoPopup;
