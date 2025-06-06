import React from "react";

const Menu = ({setIsLoginOpen, setShowRegionModal, RegionModel, switchToHome, setShowSearch, showSearch, hidden, visible}) => {
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
      <div className="flex flex-wrap gap-2 max-w-[400px]">
      <div
        onClick={switchToHome}
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer select-none"
      >
        <span role="img" aria-label="sun">☀️</span>
        <span>AeroTech</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={visible}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out
            ${showSearch ? "bg-blue-500 text-white" : "border border-white text-white"}`}
        >
          Các Chuyến Bay
        </button>
        <button
          onClick={hidden}
          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out
            ${!showSearch ? "bg-blue-500 text-white" : "border border-white text-white"}`}
        >
          Các chuyến đã đặt
        </button>
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