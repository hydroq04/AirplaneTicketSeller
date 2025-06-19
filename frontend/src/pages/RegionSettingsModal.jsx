import React, { useState, useEffect } from "react";

const RegionSettingsModal = ({ isOpen, onClose, exposeRegionModel }) => {
  // Giá trị thực lưu lại
  const [language, setLanguage] = useState("Tiếng Việt");
  const [country, setCountry] = useState("Việt Nam");
  const [currency, setCurrency] = useState("đ-VND");

  const [tempLanguage, setTempLanguage] = useState(language);
  const [tempCountry, setTempCountry] = useState(country);
  const [tempCurrency, setTempCurrency] = useState(currency);

  const countries = ["Việt Nam", "Anh", "Trung Quốc", "Thái Lan"];

  // Khi mở modal thì gán giá trị tạm = giá trị thật
  useEffect(() => {
    if (isOpen) {
      setTempLanguage(language);
      setTempCountry(country);
      setTempCurrency(currency);
    }
  }, [isOpen]);

  // Expose ra ngoài nếu cần truy cập từ parent
  useEffect(() => {
    if (exposeRegionModel) {
      exposeRegionModel({
        getLanguage: () => language,
        getCountry: () => country,
        getCurrency: () => currency,
        getLCC: () => ({ language, country, currency }),
      });
    }
  }, [language, country, currency, exposeRegionModel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative animate-fadeIn shadow-xl text-black">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6">Cài đặt vùng</h2>

        {/* Ngôn ngữ */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-sm">🌐 Ngôn ngữ</label>
          <select
            value={tempLanguage}
            onChange={(e) => setTempLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option>{language}</option>
          </select>
        </div>

        {/* Quốc gia / Khu vực */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-sm">🌏 Quốc gia / Khu vực</label>
          <p className="text-xs text-gray-500 mb-1">
            Chọn quốc gia mà bạn đang sống để cung cấp chương trình khuyến mãi phù hợp.
          </p>
          <select
            value={tempCountry}
            onChange={(e) => setTempCountry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Loại tiền */}
        <div className="mb-6">
          <label className="block font-medium mb-1 text-sm">💰 Loại tiền</label>
          <select
            value={tempCurrency}
            onChange={(e) => setTempCurrency(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option>đ-VND</option>
            <option>$-USD</option>
            <option>¥-CNY</option>
          </select>
        </div>

        {/* Nút lưu / huỷ */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-sm font-medium hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              setLanguage(tempLanguage);
              setCountry(tempCountry);
              setCurrency(tempCurrency);
              onClose();
            }}
            className="px-4 py-2 rounded bg-[#071d36] text-white text-sm font-semibold hover:bg-blue-800"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionSettingsModal;
