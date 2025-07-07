import { useState, useEffect } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const FlightDetailPanel = ({ selectedFlight, onClose, info, setBoughtList, BoughtList, setLogin, index, setIndex, showPanel, setShowPanel,  }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [airportMappings, setAirportMappings] = useState({});

  useEffect(() => {
    const fetchAirportMappings = async () => {
      try {
        const res = await fetch(`${API_Url}/api/codemaps`);
        if (!res.ok) throw new Error("Lỗi kết nối");

        const mappings = await res.json();
        const mapped = {};
        mappings.forEach((item) => {
          mapped[item.code] = item;
        });
        setAirportMappings(mapped);
      } catch (err) {
        console.error("Lỗi khi gọi API airport mappings:", err);
        setAirportMappings({});
      }
    };

    fetchAirportMappings();
  }, []);

  const handlePayment = async () => {
    setIsPaying(true);
    const { passengerData, departureDate } = info?.getInfo?.() || {};
    console.log(passengerData)
    const seatClass = passengerData?.travelClass || "economy";

    try {
      console.log(seatClass)
      const res = await fetch(`${API_Url}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: setLogin?.getUser?.()?.id,
          flightId: selectedFlight._id,
          passengerDetails: {
            email: passengerData?.email ,
            phone: passengerData?.phone ,
            adults: passengerData?.adults,
            children: passengerData?.children
          },
          seatClass: seatClass
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Booking failed");

      setIsPaying(false);
      setIsPaid(true);
      setTimeout(() => {
        setIsPaid(false);
        handleClose();
        setBoughtList(prev => {
          setIndex(index + 1);
          return [
            ...prev,
            {
              id: index,
              flight: selectedFlight,
              pd: passengerData,
              date: departureDate,
              backendId: data.booking.id,
              bookingRef: data.booking.bookingReference,
              total: data.booking.totalAmount
            }
          ];
        });
      }, 1500);
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      setIsPaying(false);
      alert("Đã có lỗi xảy ra khi thanh toán. " + error.message);
    }
  };

  

  useEffect(() => {
    if (selectedFlight) {
      setShowPanel(true);
      setIsClosing(false);
    }
  }, [selectedFlight]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPanel(false);
      onClose();
    }, 300);
  };
  
  if (!showPanel) return null;
  
  if (!setLogin.isLogin()){
    setShowPanel(false)
    setLogin.setIsLoginOpen(true)
    return null
  }

  const isBought = BoughtList?.includes(selectedFlight?.id);

  const { passengerData, departureDate } = info?.getInfo?.() || {};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()} thg ${date.getMonth() + 1}`;
  };

  const adultCount = passengerData?.adults || 0;
  const childCount = passengerData?.children || 0;
  const basePrice = selectedFlight?.price || 0;
  const totalAmount = Math.round(
         adultCount * basePrice + childCount * basePrice * 0.9
    );

  const totalPassengers = passengerData?.adults + passengerData?.children || 0;

  return (
    <>
      {/* Lớp nền mờ */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
      />

      {/* Panel chi tiết */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[420px] h-screen rounded-l-2xl bg-white z-50 shadow-lg overflow-y-auto text-black
          ${isClosing ? "animate-slide-out" : "animate-slide-in"}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold">Phiếu Đặt Chỗ</h3>
          <button onClick={handleClose} className="text-2xl font-bold">×</button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {/* Thông tin chuyến bay */}
          <div className="text-gray-500">
            {airportMappings?.[selectedFlight?.codeFrom]?.city || selectedFlight?.codeFrom} → {airportMappings?.[selectedFlight?.codeTo]?.city || selectedFlight?.codeTo} • {selectedFlight.duration}
          </div>
          <div className="text-lg font-semibold">{selectedFlight.airline}</div>
          <div className="text-xl font-bold text-red-600">
            {selectedFlight.price.toLocaleString()} VND / khách
          </div>

          {/* Thông tin thêm */}
          <div className="bg-gray-100 rounded-md p-4 space-y-1 text-sm text-gray-800">
            <p>🧍‍♂️Tổng số người: <strong>{totalPassengers}</strong></p>
            <p>👨 Số Lượng người lớn: <strong>{passengerData?.adults}</strong></p>
            <p>👶 Số Trẻ em: <strong>{passengerData?.children}</strong></p>
            <p>🎫 Hạng vé: <strong>{passengerData?.travelClass}</strong></p>
            <p>📅 Ngày khởi hành: <strong>{formatDate(departureDate)}</strong></p>
          </div>
            Tổng tiền
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md text-sm">
            💰 <strong>Tổng số tiền:</strong> {totalAmount.toLocaleString()} VND
            </div>
        
            {isPaying ? (
            <div className="w-full bg-[#071d36] text-white py-2 rounded font-semibold text-center animate-pulse">
                Đang xử lý thanh toán...
            </div>
            ) : isPaid ? (
            <div className="w-full bg-green-500 text-white py-2 rounded font-semibold text-center animate-fade-in">
                ✅ Thanh toán thành công!
            </div>
            ) : (
            <button
                onClick={handlePayment}
                className="w-full bg-[#071d36] transform transition-all duration-200 ease-out hover:scale-105 text-white py-2 rounded font-semibold mt-4"
            >
                Thanh Toán
            </button>
            )}
            <hr />
            <span className="text-gray-700 space-y-1" >Các điều khoản và ưu đãi:</span>
            {/* Lợi ích */}
            <ul className="text-gray-700 space-y-1">
            <li>🧳 Hành lý xách tay 7kg</li>
            <li>📦 Ký gửi 20kg</li>
            <li>💳 Có thể hoàn lên đến 75%</li>
            <li>💸 Giảm 10% cho trẻ em</li>
            </ul>
        </div>
      </div>
    </>
  );
};

export default FlightDetailPanel;
