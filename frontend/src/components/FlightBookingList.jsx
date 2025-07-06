import React, { useRef, useState, useEffect } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const FlightBookingList = ({ setLogin, favorites, setFavorites, setSelectedFlight, bookingRoute}) => {
  const { from, to, departureDate } = bookingRoute;
  const [flights, setFlights] = useState([]);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');     // 01 → 09
    const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    if (!from || !to || !departureDate) return;

    const fetchFlights = async () => {
      try {
        const query = new URLSearchParams({
          origin: from,
          destination: to,
          date: formatDate(departureDate)
        }).toString();
        console.log(query)
        const response = await fetch(`${API_Url}/api/flights/search?${query}`);
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        console.error("Lỗi khi gọi API flights:", err);
        setFlights([]); // fallback nếu lỗi
      }
    };

    fetchFlights();
  }, [from, to, departureDate]);


  const [open, setOpen] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  const [departTime, setDepartTime] = useState([0, 23]);
  const [returnTime, setReturnTime] = useState([0, 23]);

  const [duration, setDuration] = useState(24.5);
  const [durationOpen, setDurationOpen] = useState(true);
  const durationRef = useRef(null);
  const [durationHeight, setDurationHeight] = useState(0);

  const [airlinesOpen, setAirlinesOpen] = useState(true);
  const [selectedAirlines, setSelectedAirlines] = useState([
    "VietJet Air",
    "Vietnam Airlines",
    "Các kết hợp hàng không",
  ]);


  // Đổi tên ref cho rõ ràng hơn
  const airlinesRef = useRef(null);
  const [airlinesHeight, setAirlinesHeight] = useState(0);

  const toggleFavorite = (id) => {
    if (setLogin.isLogin()){
          const updated = favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];

      setFavorites(updated);
    }
    else setLogin.setIsLoginOpen(true)
  };



  useEffect(() => {
    if (airlinesOpen && airlinesRef.current) {
      setAirlinesHeight(airlinesRef.current.scrollHeight);
    }
  }, [airlinesOpen, selectedAirlines]);


  const allAirlines = [
    { name: "VietJet Air", price: 1570780 },
    { name: "Vietnam Airlines", price: 2551000 },
    { name: "Các kết hợp hàng không", price: 2261999 },
  ];
  const isAllSelected = selectedAirlines.length === allAirlines.length;


  const toggleAirline = (name) => {
    setSelectedAirlines((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const selectAllAirlines = () => {
    setSelectedAirlines(allAirlines.map((a) => a.name));
  };

  const clearAllAirlines = () => {
    setSelectedAirlines([]);
  };


  useEffect(() => {
    if (durationOpen && durationRef.current) {
      setDurationHeight(durationRef.current.scrollHeight);
    }
  }, [durationOpen, duration]);


  const formatTime = (val) => {
    const hour = Math.floor(val);
    return `${hour.toString().padStart(2, "0")}h`;
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [open, departTime, returnTime]);

  const DualSlider = ({ value, setValue, min = 0, max = 23, step = 1 }) => {
    const handleLeftChange = (e) => {
      const newLeft = Math.min(+e.target.value, value[1] - step);
      setValue([newLeft, value[1]]);
    };

    const handleRightChange = (e) => {
      const newRight = Math.max(+e.target.value, value[0] + step);
      setValue([value[0], newRight]);
    };

    return (
      <div className="flex items-center gap-4 mt-2">
        <div className="flex flex-col items-start w-1/2">
          <label className="mb-1 text-sm text-gray-600">Từ</label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleLeftChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col items-start w-1/2">
          <label className="mb-1 text-sm text-gray-600">Đến</label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleRightChange}
            className="w-full"
          />
        </div>
      </div>
    );
  };

  return (
// ================================= BLOCK BÊN TRÁI ===========================================
    <div className="bg-gray-100 text-black p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {from} → {to}
        </h2>
      </div>
{/* ============================= SETUP THỜI GIAN KHỞI HÀNH =================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Bộ lọc */}
        <div className="bg-white rounded shadow p-4 text-sm space-y-6">
          <div>
            <p className="font-semibold mb-2">Các chặng dừng</p>
            <label className="block mb-1">
              <input type="checkbox" defaultChecked className="mr-2" />
              Trực tiếp{" "}
              <span className="text-gray-500 ml-1">từ 1.570.780 ₫</span>
            </label>
            <label className="block mb-1">
              <input type="checkbox" className="mr-2" />
              1 chặng dừng{" "}
              <span className="text-gray-500 ml-1">từ 4.140.665 ₫</span>
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" />
              2+ chặng dừng{" "}
              <span className="text-gray-500 ml-1">từ 16.180.443 ₫</span>
            </label>
          </div>

          <hr />
                
          <div className="bg-gray-100 p-4 rounded-md transition-all">
            {/* Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <p className="font-semibold text-[16px] text-black">Giờ khởi hành</p>
              <span>{open ? "▲" : "▼"}</span>
            </div>

            {/* Nội dung với animation */}
            <div
              ref={contentRef}
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: open ? contentHeight : 0,
                opacity: open ? 1 : 0,
              }}
            >
              <div className="mt-4 space-y-4">
                <div className="text-[15px] text-black leading-tight">
                  <p className="font-medium">Chuyến đi</p>
                  <p className="mt-1 text-[14px] text-gray-700">
                    {formatTime(departTime[0])} – {formatTime(departTime[1])}
                  </p>
                  <DualSlider value={departTime} setValue={setDepartTime} />
                </div>

                {/* <div className="text-[15px] text-black leading-tight">
                  <p className="font-medium">Quay về</p>
                  <p className="mt-1 text-[14px] text-gray-700">
                    {formatTime(returnTime[0])} – {formatTime(returnTime[1])}
                  </p>
                  <DualSlider value={returnTime} setValue={setReturnTime} />
                </div> */}
              </div>
            </div>
          </div>
          <hr />
{/* =================================== THỜI GIAN KÉO DÀI CỦA HÀNH TRÌNH ================================================= */}
          <div className="bg-gray-100 p-4 rounded-md transition-all">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setDurationOpen(!durationOpen)}
            >
              <p className="font-semibold text-[16px] text-black">
                Thời gian kéo dài của hành trình
              </p>
              <span className={`transition-transform duration-300 ${durationOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>

            <div
              ref={durationRef}
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: durationOpen ? durationHeight : 0,
                opacity: durationOpen ? 1 : 0.5,
              }}
            >
              <div className="mt-4 text-[15px] text-black leading-tight">
                <p className="text-[14px] text-gray-700 mb-2">
                  1,0 giờ – {duration.toLocaleString("vi-VN", { minimumFractionDigits: 1 })} giờ
                </p>
                <input
                  type="range"
                  min={1}
                  max={24.5}
                  step={0.5}
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
          <hr />
{/* ============================ Chọn Hãng ======================================== */}
            <div className="bg-gray-100 p-4 rounded-md transition-all">
              {/* Header accordion */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setAirlinesOpen(!airlinesOpen)}
              >
                <p className="font-semibold text-[16px] text-black">Hãng hàng không</p>
                <span
                  className={`inline-block transition-transform duration-300 ${
                    airlinesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {/* Nội dung xổ xuống */}
              <div
                ref={airlinesRef}
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: airlinesOpen ? airlinesHeight : 0,
                  opacity: airlinesOpen ? 1 : 0.5,
                }}
              >
                <div className="mt-4 space-y-3">
                  {/* Nút chọn/xoá tất cả */}
                  <div className="text-sm flex items-center justify-between">
                    <button
                      onClick={selectAllAirlines}
                      className={`font-medium transition-all duration-200 ease-in-out ${
                        isAllSelected
                          ? "text-gray-400 cursor-default"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                      disabled={isAllSelected}
                    >
                      Chọn tất cả
                    </button>

                    <button
                      onClick={clearAllAirlines}
                      className={`font-medium transition-all duration-200 ease-in-out ${
                        selectedAirlines.length === 0
                          ? "text-gray-400 cursor-default"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                      disabled={selectedAirlines.length === 0}
                    >
                      Xoá tất cả
                    </button>
                  </div>

                  {/* Danh sách hãng */}
                  {allAirlines.map((airline) => (
                    <label key={airline.name} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline.name)}
                        onChange={() => toggleAirline(airline.name)}
                        className="accent-blue-600 w-4 h-4 mt-[3px]"
                      />
                      <span className="text-sm leading-tight">
                        {airline.name}
                        <span className="block text-gray-500 text-xs mt-0.5">
                          từ {airline.price.toLocaleString()} ₫
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

        </div>
{/* ================================== BLOCK BÊN PHẢI ======================================================= */}
        {/* Danh sách chuyến bay */}
        <div className="md:col-span-3 space-y-4">
          {flights.map((flight, idx) => {
            const isFavorite = favorites.includes(flight.id);
            return (
              <div
                key={idx}
                className="bg-white border rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
              >
                <button
                  onClick={() => toggleFavorite(flight.id)}
                  className={`mr-4 w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300
                              ${isFavorite ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100 border-transparent"}`}
                  title={isFavorite ? "Đã lưu" : "Lưu vào yêu thích"}
                >
                  <span
                    className={`text-lg transition-all duration-300 ease-in-out transform
                                ${isFavorite ? "text-blue-600 scale-110" : "text-gray-400 hover:scale-110"}`}
                  >
                    ♥
                  </span>
                </button>
                {/* Bên trái: Thông tin chuyến bay */}
                <div className="flex items-center gap-6 flex-1">
                  {/* Tên hãng */}
                  <div className="w-20 text-sm font-semibold text-center text-gray-700">
                    {flight.airline}
                  </div>

                  {/* Thời gian bay */}
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-black">
                      <span>{flight.timeFrom}</span>
                      <span className="text-gray-400">→</span>
                      <span>{flight.timeTo}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{flight.codeFrom} → {flight.codeTo}</span>
                      <span>•</span>
                      <span>{flight.duration}</span>
                      <span>•</span>
                      <span className="text-green-600">{flight.type}</span>
                    </div>
                  </div>
                </div>

                {/* Bên phải: Giá + nút chọn */}
                <div className="text-right min-w-[130px]">
                  <p className="text-xs text-gray-500">1 tùy chọn từ</p>
                  <p className="text-xl font-bold text-black">
                    {flight.price.toLocaleString()} ₫
                  </p>
                    <button
                      className="mt-2 px-4 py-1 bg-[#071d36] text-white rounded hover:bg-blue-800 text-sm font-semibold"
                      onClick={() => setSelectedFlight(flight)}
                    >
                      Chọn →
                    </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default FlightBookingList;
