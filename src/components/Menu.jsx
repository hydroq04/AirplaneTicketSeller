import React, {useState} from "react";
import AccountInfoPopup from "./AccountInfoPopup";

const Menu = ({setIsLoginOpen, setShowRegionModal, user, ticketCount ,RegionModel, switchToHome, showSearch, hidden, visible, logined, avatarUrl = "https://i.pravatar.cc", onLogout }) => {
    if (!RegionModel) return;
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [role, setRole] = useState(null);

    const { language, country, currency } = RegionModel.getLCC();
    const convert_country = (country) => {
      if (country =="Việt Nam")
          return "🇻🇳"
      else if (country == "Anh")
          return "USA"
      return "ex"
    }
  // Vai trò fetch từ bộ nhớ local
  useEffect(() => {
    const simulatedToken = localStorage.getItem('token');
    if (simulatedToken) {
      const simulatedRole = simulatedToken.includes('admin') ? 'admin' : 'user';
      setRole(simulatedRole);
    } else {
      setRole('user');
    }
  }, [logined]); // Chạy lại khi trang thái đăng nhập thay đổi.
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
        <div className="relative transition-all duration-300 ease-in-out">
          {logined ? (
            <img
              key="avatar"
              src={avatarUrl}
              onClick={() => setShowAccountPopup(true)}
              alt="avatar"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out opacity-100 scale-100"
            />
          ) : (
            <button
              key="login"
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-[#071d36] px-4 py-1 rounded font-semibold text-sm shadow-sm
                        transition-all duration-300 ease-in-out hover:scale-110 opacity-100 scale-100"
            >
              Đăng nhập
            </button>
          )}

          {/* Popup info */}
          {logined && showAccountPopup && (
            <AccountInfoPopup
              user={user}
              ticketCount={ticketCount}
              onClose={() => setShowAccountPopup(false)}
              onLogout={onLogout}
            >
              {role === 'admin' && (
                <div className="mt-2">
                  <a href="/#revenue" className="block text-blue-400 hover:underline">Revenue Report</a>
                  <a href="/#flights" className="block text-blue-400 hover:underline mt-1">Flight Details</a>
                </div>
                )}
            </AccountInfoPopup>
          )}
        </div>

      </div>
    </section>
  );
};

export default Menu;
