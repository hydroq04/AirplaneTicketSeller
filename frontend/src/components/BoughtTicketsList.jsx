import React, { useEffect, useRef, useState } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const BoughtTicketsList = ({ showBought,selectedTicket, setSelectedTicket, user }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [clickRect, setClickRect] = useState(null);
  const modalRef = useRef();
  const [list, setList] = useState([]);
  const [airportMappings, setAirportMappings] = useState({});

  const formatTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return dateTimeStr;
      
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return dateTimeStr; 
    }
  };

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

  useEffect(() => {
    console.log(user)
    const userId = user?._id || user?.id;
    if (!showBought || !userId) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_Url}/api/bookings/user/${userId}`);
        if (!res.ok) throw new Error("Lỗi kết nối");

        const bookings = await res.json();

        const allTickets = bookings.flatMap((booking) =>
          booking.tickets.map((ticket) => ({
            ...ticket,
            _id: ticket._id,
            id: ticket.ticketNumber,
            date: ticket.flight.timeFrom,
            flight: ticket.flight,
            pd: {
              travelClass: ticket.class || "Phổ thông",
              adults: ticket.passengerType === "adults" ? 1 : 0,
              children: ticket.passengerType === "children" ? 1 : 0,
            }
          }))
        );

        setList(allTickets);
      } catch (err) {
        console.error("Lỗi khi gọi API booking:", err);
        setList([]);
      }
    };

    fetchTickets();
  }, [showBought, user]);



  const handleCardClick = (ticket, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickRect({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setSelectedTicket(ticket);
  };

const handleCloseModal = () => {
  if (!modalRef.current || !clickRect) return;
  const modal = modalRef.current;

  

  modal.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
  modal.style.opacity = "0"; // Mờ dần ra
  modal.style.transform = "scale(0.9)";
  modal.style.top = `${clickRect.y}px`;
  modal.style.left = `${clickRect.x}px`;
  modal.style.width = `${clickRect.width}px`;
  modal.style.height = `${clickRect.height}px`;
  modal.style.maxWidth = "unset";

  setIsClosing(true);
  setTimeout(() => {
    setIsClosing(false);
    setSelectedTicket(null);
    setClickRect(null);
  }, 500); // match với duration
};

const handleCancelTicket = async () => {
  if (!selectedTicket) return;

  try {
    console.log("Hủy vé:", selectedTicket);
    const res = await fetch(`${API_Url}/api/tickets/${selectedTicket._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Lỗi khi huỷ vé");
    setList((prevList) => prevList.filter((t) => t.id !== selectedTicket.id));
  } catch (err) {
    alert("Không thể huỷ vé: " + err.message);
  }

  // Đóng modal
  handleCloseModal();
};



    useEffect(() => {
    if (!modalRef.current || !clickRect) return;
    const modal = modalRef.current;

    modal.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
    modal.style.opacity = "0"; // Bắt đầu mờ

    requestAnimationFrame(() => {
        modal.style.opacity = "1"; // Mờ dần vào
        modal.style.transform = "translate(-50%, -50%) scale(1)";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.width = "90%";
        modal.style.height = "auto";
        modal.style.maxWidth = "28rem";
    });
    }, [clickRect]);



//   if (!showBought) return <></>;

  return (
    
    <>
      {/* Danh sách vé */}
    <div className={`
    transition-all duration-700 ease-in-out origin-top
    ${showBought 
        ? "bg-white p-6 rounded-xl max-w-6xl mx-auto shadow-md opacity-100 scale-y-100 h-auto"
        : "opacity-0 scale-y-0 h-0 overflow-hidden pointer-events-none"}
    `}>
    <h2 className="text-xl font-semibold text-[#071d36] mb-4">🎫 Danh sách vé đã đặt</h2>

    {(!list || list.length === 0) ? (
        <div className="text-center text-gray-500 p-6">
        Bạn chưa đặt chuyến bay nào.
        </div>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((ticket, idx) => {
            const date = new Date(ticket.date);
            const formattedDate = `${date.getDate()} thg ${date.getMonth() + 1}`;
            const totalPassenger = ticket.pd.adults + ticket.pd.children;

            return (
            <div
                key={idx}
                onClick={(e) => handleCardClick(ticket, e)}
                className="cursor-pointer bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-gray-200 shadow-md px-6 py-5 transition-all duration-300 hover:shadow-lg animate-fade-in-up flex flex-col justify-between min-h-[130px]"
            >
                <div>
                <h3 className="font-semibold text-base text-blue-700">
                    {ticket.flight.airline}
                </h3>
                <p className="text-sm text-gray-600">
                    {formattedDate} • {ticket.pd.travelClass}
                </p>
                </div>
                <div className="text-sm text-black text-right leading-tight">
                <p>{totalPassenger} hành khách</p>
                <p className="text-xs text-gray-500">
                    {ticket.pd.adults} NL, {ticket.pd.children} TE
                </p>
                </div>
            </div>
            );
        })}
        </div>
    )}
    </div>


      {/* Modal chi tiết */}
      {selectedTicket && clickRect && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${
            isClosing ? "opacity-0" : "opacity-100"
            }`}

            onClick={handleCloseModal}
          />

          {/* Modal */}
            <div
            ref={modalRef}
            className="fixed z-50 bg-white rounded-2xl shadow-2xl px-6 py-5 transform overflow-hidden"
            style={{
                top: clickRect.y,
                left: clickRect.x,
                width: clickRect.width,
                height: clickRect.height,
                transform: isClosing ? "scale(0.9)" : "translate(-50%, -50%) scale(1)",
                transformOrigin: "center center",
                opacity: 1, // ✨ Luôn có mặc định ban đầu
            }}
            >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>

<h3 className="text-2xl font-bold text-[#071d36] mb-4 text-center">
  🎟️ Vé Chuyến Bay #{selectedTicket.id}
</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
  <div>
    <p className="mb-1 font-medium">✈️ Hãng bay:</p>
    <p className="text-gray-800">{selectedTicket.flight.airline}</p>
  </div>

  <div>
    <p className="mb-1 font-medium">🛫 Thời gian bay:</p>
    <p className="text-gray-800">
      {formatTime(selectedTicket.flight.timeFrom)} → {formatTime(selectedTicket.flight.timeTo)}
    </p>
  </div>

  <div>
    <p className="mb-1 font-medium">💸 Giá vé: </p>
    <p className="text-gray-800">
      {selectedTicket.flight.price?.toLocaleString()} ₫
    </p>
  </div>



  <div>
    <p className="mb-1 font-medium">📍 Chuyến bay:</p>
    <p className="text-gray-800">
      {airportMappings[selectedTicket.flight.codeFrom]?.airportName || selectedTicket.flight.codeFrom} - {airportMappings[selectedTicket.flight.codeFrom]?.city || selectedTicket.flight.codeFrom} → {airportMappings[selectedTicket.flight.codeTo]?.airportName || selectedTicket.flight.codeTo} - {airportMappings[selectedTicket.flight.codeTo]?.city || selectedTicket.flight.codeFrom}
    </p>
  </div>

  <div>
    <p className="mb-1 font-medium">📅 Ngày khởi hành:</p>
    <p className="text-gray-800">
      {new Date(selectedTicket.date).toLocaleDateString()}
    </p>
  </div>

  <div>
    <p className="mb-1 font-medium">👥 Hành khách:</p>
    <p className="text-gray-800">
      {selectedTicket.pd.adults} người lớn, {selectedTicket.pd.children} trẻ em
    </p>
  </div>

  <div>
    <p className="mb-1 font-medium">🆔 CCCD:</p>
    <p className="text-gray-800">{user?.cccd || "Chưa cập nhật"}</p>
  </div>

  <div>
    <p className="mb-1 font-medium">📞 Số điện thoại:</p>
    <p className="text-gray-800">{user?.phone || "Chưa cập nhật"}</p>
  </div>

  <div>
    <p className="mb-1 font-medium">💺 Hạng vé:</p>
    <p className="text-gray-800">{selectedTicket.pd.travelClass}</p>
  </div>
</div>

            {/* Nút Hủy */}
            <button
              onClick={()=>{
                handleCloseModal()
                handleCancelTicket()
              }}
              className="mt-5 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              Hủy Đặt vé
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default BoughtTicketsList;
