import React, { useEffect, useRef, useState } from "react";

const BoughtTicketsList = ({ showBought, list, setList, selectedTicket, setSelectedTicket }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [clickRect, setClickRect] = useState(null);
  const modalRef = useRef();

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

const handleCancelTicket = () => {
  if (!selectedTicket) return;

  // Xóa vé khỏi danh sách
  setList((prevList) => prevList.filter((t) => t.id !== selectedTicket.id));

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
                    Mã vé: #{ticket.id}
                </h3>
                <p className="text-sm text-gray-600">
                    {formattedDate} • {ticket.pd.travelClass}
                </p>
                </div>
                <div className="text-sm text-right leading-tight">
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

            <h3 className="text-xl font-bold text-[#071d36] mb-3">🎟️ Mã vé: #{selectedTicket.id}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                📅 Ngày khởi hành:{" "}
                <strong>{new Date(selectedTicket.date).toLocaleDateString()}</strong>
              </p>
              <p>
                🧍‍♂️ {selectedTicket.pd.adults} người lớn, {selectedTicket.pd.children} trẻ em
              </p>
              <p>
                🎫 Hạng khoang: <strong>{selectedTicket.pd.travelClass}</strong>
              </p>
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
