import React, { useState, useRef, useEffect } from "react";
import PassengerClassSelector from "./PassengerClassSelector";
import PassengerClassPortal from "./PassengerClassPortal";

const FlightSearchFormFull = ({ from, to, setFrom, setTo, handleSwap, handleSearch, showForm, setSumPassenger, departureDate, setDepartureDate, setInfo }) => {
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    travelClass: "Phổ thông"
  });

  const [showPassengerSelector, setShowPassengerSelector] = useState(false);
  const passengerRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState("top"); // "top" hoặc "bottom"

  const formatPassengerText = () => {
    const total = passengerData.adults + passengerData.children;
    return `${total} ${(total>1)?"hành khách":"người lớn"}, ${passengerData.travelClass}`;
  };
  
  useEffect(() => {
    const total = passengerData.adults + passengerData.children;
    setSumPassenger(total);
  }, [passengerData]);

  useEffect(() => {
    if(setInfo){
      setInfo({
        getInfo: () => ({passengerData, departureDate})
      })
    }
  }, [passengerData, departureDate]);
  const handlePassengerClick = (e) => {
    const rect = passengerRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Ưu tiên hiện phía trên nếu đủ chỗ
    if (spaceAbove > 320 || spaceAbove > spaceBelow) {
      setPopupPosition("top");
    } else {
      setPopupPosition("bottom");
    }

    setShowPassengerSelector(true);
  };

  return (
    <section
      className={`bg-[#061c37] text-white p-4 rounded-xl transition-all duration-700 ease-in-out 
        overflow-visible origin-top 
        ${showForm ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}`}
    >
      {/* Tabs */}
      <div className="flex gap-4 mb-4 text-sm font-medium">
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" defaultChecked />
          <span>Khứ hồi</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" />
          <span>Một chiều</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" />
          <span>Nhiều thành phố</span>
        </label>
      </div>

      {/* Form main */}
      <div className="flex flex-col md:flex-row gap-2 text-black">
        {/* Từ - Đến */}
        <div className="relative flex items-center gap-0 bg-white rounded-xl overflow-hidden flex-grow">
          <div className="flex-1 p-4 border-r">
            <label className="text-xs text-gray-500 block mb-1">Từ</label>
            <input
              type="text"
              className="text-black w-full outline-none"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="absolute left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
          >
            ⇄
          </button>

          <div className="flex-1 p-4 border-l pl-6">
            <label className="text-xs text-gray-500 block mb-1">Đến</label>
            <input
              type="text"
              className="text-black w-full outline-none"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        {/* Ngày & Hành khách */}
        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="p-3 rounded-md" />

        <div
          ref={passengerRef}
          onClick={handlePassengerClick}
          className="relative p-3 rounded-md bg-white cursor-pointer border border-gray-300 hover:shadow-md min-w-[230px]"
        >
          {formatPassengerText()}

        {showPassengerSelector && (
          <PassengerClassPortal>
            <div
              className="absolute z-[9999]"
              style={{
                position: "absolute",
                top: popupPosition === "top"
                  ? passengerRef.current.getBoundingClientRect().top -320
                  : passengerRef.current.getBoundingClientRect().bottom + 10,
                left: passengerRef.current.getBoundingClientRect().left,
              }}
            >
              <PassengerClassSelector
                value={passengerData}
                onChange={(data) => setPassengerData(data)}
                onClose={() => setShowPassengerSelector(false)}
                position={popupPosition}
              />
            </div>
          </PassengerClassPortal>
        )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 rounded-md hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Thêm các sân bay gần đây</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Chỉ các chuyến bay thẳng</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Thêm các sân bay gần đây</span>
        </label>
      </div>
    </section>
  );
};

export default FlightSearchFormFull;
