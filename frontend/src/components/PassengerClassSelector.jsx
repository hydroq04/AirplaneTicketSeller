import React, { useEffect, useRef, useState } from "react";

const PassengerClassSelector = ({ value, onChange, onClose, position = "top" }) => {
  const [adults, setAdults] = useState(value?.adults || 1);
  const [children, setChildren] = useState(value?.children || 0);
  const [travelClass, setTravelClass] = useState(value?.travelClass || "Phổ thông");
  const [isVisible, setIsVisible] = useState(true);

  const ref = useRef();

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        hideWithAnimation();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Animate hide
  const hideWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  // Trigger thay đổi lên cha
  useEffect(() => {
    onChange?.({ adults, children, travelClass });
  }, [adults, children, travelClass]);

  return (
    <div
      ref={ref}
      className={`
        relative w-[340px] bg-white text-black p-5 rounded-2xl shadow-2xl 
        transition-all duration-200 ease-out z-50
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      {/* Mũi nhọn */}
      <div
        className={`
          absolute w-4 h-4 bg-white rotate-45 shadow-md
          ${position === "top" ? "bottom-[-6px] left-1/2 -translate-x-1/2" : ""}
          ${position === "bottom" ? "top-[-6px] left-1/2 -translate-x-1/2" : ""}
        `}
      />

      {/* Nội dung chọn */}
      <div>
        {/* Chọn hạng khoang */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Hạng khoang</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-blue-500"
          >
            <option>Phổ thông</option>
            <option>Phổ thông đặc biệt</option>
            <option>Thương gia</option>
            <option>Hạng nhất</option>
          </select>
        </div>

        {/* Người lớn / trẻ em */}
        {[{ label: "Người lớn", age: "Từ 18 tuổi trở lên", value: adults, set: setAdults, min: 1 },
          { label: "Trẻ em", age: "Từ 0 đến 17 tuổi", value: children, set: setChildren, min: 0 }]
          .map((item, i) => (
            <div key={i} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.age}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={item.value <= item.min}
                  onClick={() => item.set(item.value - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-lg font-medium hover:bg-gray-300 disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-[20px] text-center">{item.value}</span>
                <button
                  onClick={() => item.set(item.value + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-lg font-medium hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}

        <p className="text-xs text-gray-500 mt-3 leading-snug">
          Tuổi của bạn phải hợp lệ khi đặt vé. Vui lòng kiểm tra với hãng trước khi đặt.
        </p>

        {/* Nút Xong */}
        <div className="flex justify-end mt-4">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={hideWithAnimation}
            className="text-blue-600 font-semibold hover:underline"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
export default PassengerClassSelector;
