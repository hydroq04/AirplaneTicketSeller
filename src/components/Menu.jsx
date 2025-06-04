import React from "react";

const Menu = ({setIsLoginOpen, setShowRegionModal, RegionModel}) => {
    if (!RegionModel) return;
    
    const { language, country, currency } = RegionModel.getLCC();
    const convert_country = (country) => {
      if (country =="Việt Nam")
          return "🇻🇳"
      else if (country == "Anh")
          return "USA"
      return "ex"
    }
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
        <button 
        className="bg-slate-700 text-sm px-3 py-1 rounded hover:bg-[#020912]"
        onClick={()=>{setShowRegionModal(true)}}>🌐 {language} {convert_country(country)} {currency}</button>
        <span>🤍</span>
      <button 
        onClick={() => setIsLoginOpen(true)}
        className="bg-white text-[#071d36] px-4 py-1 rounded font-semibold text-sm 
                  hover:scale-125 shadow-sm transition-all duration-300"
      >
        Đăng nhập
      </button>

      </div>
    </section>
  );
};

export default Menu;