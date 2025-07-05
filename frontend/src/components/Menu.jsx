import React, { useState } from "react";
import AccountInfoPopup from "./AccountInfoPopup";

const Menu = ({
  setIsLoginOpen,
  setShowRegionModal,
  user,
  ticketCount,
  RegionModel,
  switchToHome,
  showSearch,
  hidden,
  visible,
  logined,
  avatarUrl = "https://i.pravatar.cc",
  onLogout,
  switchToHomeAdmin,
  setShowReportPage,
  setLogin,
  setShowFlightListAdmin,
  setActiveTab,
  setShowCustomerListAdmin,
  setShowForm,
  setIsAdmin,
  setShowChangePolicy_
}) => {
  if (!RegionModel) return null;
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showListFlight, setShowListFlight] = useState(false);
  const [showInfoPassenger, setShowInfoPassenger] = useState(false);
  const [showChangePolicy, setShowChangePolicy] = useState(false);

  const { language, country, currency } = RegionModel.getLCC();

  const convert_country = (country) => {
    if (country === "Việt Nam") return "🇻🇳";
    else if (country === "Anh") return "USA";
    return "🌍";
  };

  const isAdmin = user?.role === "admin";

  const handleAdminClick = (section) => {
    setShowReport(section === "report");
    setShowListFlight(section === "listFlight");
    setShowInfoPassenger(section === "infoPassenger");
    setShowChangePolicy(section === "changePolicy");
  };

  return (
    <section className="flex justify-between items-start px-6 py-4 bg-[#071d36] shadow-md flex-wrap">
      {/* Cột trái: logo + menu */}
      <div className="flex flex-col items-start gap-y-2 max-w-[1100px]">
        {/* Logo */}
        <div
          onClick={(isAdmin)? switchToHomeAdmin : switchToHome}
          className="text-2xl font-bold flex items-center gap-2 cursor-pointer select-none text-white"
        >
          <span role="img" aria-label="sun">☀️</span>
          <span>AeroTech</span>
        </div>

        {/* Menu nút */}
        <div className="flex flex-wrap gap-2">
          {!isAdmin && (
            <>
              <button
                onClick={visible}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  showSearch ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}
              >
                Các Chuyến Bay
              </button>
              <button
                onClick={hidden}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  !showSearch ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}
              >
                Các chuyến đã đặt
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                  onClick={() => {
                    setLogin?.setShowHome?.(false)
                    handleAdminClick("report");
                    setShowReportPage?.(true); // gọi mở báo cáo
                    setShowFlightListAdmin?.(false)
                    setShowChangePolicy_?.(false);
                    setShowCustomerListAdmin?.(false)
                  }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  showReport ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}
              >
                Báo cáo doanh thu
              </button>
              <button
                onClick={() => {
                  handleAdminClick("listFlight");
                  setLogin?.setShowHome?.(false)
                  setShowReportPage?.(false); 
                  setShowCustomerListAdmin?.(false)
                  setShowChangePolicy_?.(false);
                  setShowFlightListAdmin?.(true);
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  showListFlight ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}
              >
                Danh sách chuyến bay
              </button>
              <button
                onClick={() => {
                  handleAdminClick("infoPassenger");
                  setLogin?.setShowHome?.(false)
                  setShowReportPage?.(false); 
                  setShowCustomerListAdmin?.(true)
                  setShowChangePolicy_?.(false);
                  setShowFlightListAdmin?.(false);

                }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  showInfoPassenger ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}
              >
                Thông tin khách hàng
              </button>
              <button
                onClick={() => {
                  handleAdminClick("changePolicy");
                  setLogin?.setShowHome?.(false)
                  setShowReportPage?.(false);
                  setShowCustomerListAdmin?.(false);
                  setShowFlightListAdmin?.(false);
                  setShowChangePolicy_(true);
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out ${
                  showChangePolicy ? "bg-blue-500 text-white" : "border border-white text-white"
                }`}>
                Thay Đổi Quy Định
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cột phải: trợ giúp + avatar */}
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <span className="text-sm text-white">Trợ giúp</span>
        <button
          className="bg-slate-700 text-sm px-3 py-1 rounded hover:bg-[#020912] text-white"
          onClick={() => setShowRegionModal(true)}
        >
          🌐 {language} {convert_country(country)} {currency}
        </button>
        <span>🤍</span>

        <div className="relative transition-all duration-300 ease-in-out">
          {logined ? (
            <img
              key="avatar"
              src={avatarUrl}
              onClick={() => setShowAccountPopup(true)}
              alt="avatar"
              className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out"
            />
          ) : (
            <button
              key="login"
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-[#071d36] px-4 py-1 rounded font-semibold text-sm shadow-sm
                transition-all duration-300 ease-in-out hover:scale-110"
            >
              Đăng nhập
            </button>
          )}

          {logined && showAccountPopup && (
            <AccountInfoPopup
              user={user}
              ticketCount={ticketCount}
              onClose={() => setShowAccountPopup(false)}
              onLogout={onLogout}
              switchToHome= {switchToHome}
              setIsAdmin = {setIsAdmin}
              switchToHomeAdmin={switchToHomeAdmin}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;
