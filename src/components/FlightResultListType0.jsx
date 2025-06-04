import React, { useState, useEffect } from "react";

const tabs = [
  { key: "cheap", label: "Chuyến bay rẻ nhất" },
  { key: "direct", label: "Chuyến bay thẳng" },
  { key: "suggestions", label: "Đề Xuất Cho Bạn" },
];

const FlightResultListType0 = ({ resultsByTab, setToAndSearch }) => {
  const [activeTab, setActiveTab] = useState("cheap");
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [pendingTo, setPendingTo] = useState(null);

  const handleTabChange = (key) => {
    if (key === activeTab) return;
    setIsTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(key);
      setIsTabTransitioning(false);
    }, 300);
  };

  const handleFlightClick = (to) => {
    setIsFading(true);
    setPendingTo(to);
  };

  useEffect(() => {
    if (isFading && pendingTo) {
      const timeout = setTimeout(() => {
        setToAndSearch(pendingTo);
        setIsFading(false);
        setPendingTo(null);
      }, 300); // khớp với CSS animation

      return () => clearTimeout(timeout);
    }
  }, [isFading, pendingTo, setToAndSearch]);

  const currentList = resultsByTab[activeTab] || [];

  return (
    <div className="bg-gray-100 text-black py-8 px-4 transition-all">
    <div className="bg-gray-100 text-black py-8 px-4 transition-all">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-4">
            Khám phá Việt Nam từ Th 2 09 đến Th 2 16 Tháng 6
          </h2>

          <div className="flex justify-start gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 border 
                  ${
                    activeTab === tab.key
                      ? "bg-[#071d36] text-white"
                      : "bg-white text-[#071d36] border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>


      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto transition-opacity duration-300 ease-in-out ${
          isTabTransitioning || isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {currentList.map((flight, index) => (
          <button
            key={index}
            onClick={() => handleFlightClick(flight.name)}
            className="bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <img
              src={`src/assets/${flight.name}.jpg`}
              alt={flight.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{flight.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Vé máy bay • Bay thẳng</p>
              <p className="text-sm text-gray-600 mb-4">Khách sạn • 4 sao</p>
              <p className="text-xl font-semibold text-right">
                {flight.price.toLocaleString()} ₫
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightResultListType0;
