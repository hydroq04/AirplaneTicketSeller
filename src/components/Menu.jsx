import React from "react";

const Menu = () => {
  return (
    <section className="flex justify-between items-center px-6 py-4 bg-[#071d36] shadow-md">
      <div className="flex flex-wrap gap-2 max-w-[500px]">
        <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <span>☀️</span>
            <span>Airplane Ticket Seller</span>
        </a>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">Các Chuyến Bay</button>
          <button className="border border-white px-4 py-2 rounded-full text-sm">Các chuyến đã đặt</button>
          <button className="border border-white px-4 py-2 rounded-full text-sm">Báo cáo</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Trợ giúp</span>
        <button className="bg-slate-700 text-sm px-3 py-1 rounded">🌐 Tiếng Việt 🇻🇳 đ VND</button>
        <span>🤍</span>
        <button className="bg-white text-[#071d36] px-4 py-1 rounded font-semibold text-sm">Đăng nhập</button>
      </div>
    </section>
  );
};

export default Menu;