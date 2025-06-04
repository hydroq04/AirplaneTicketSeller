import React, { useState } from "react";

const tabs = [
  { key: "cheap", label: "Chuyến bay rẻ nhất" },
  { key: "direct", label: "Chuyến bay thẳng" },
  { key: "all", label: "Mọi địa điểm hiện có" },
];

const FlightResultListType1 = ({ resultsByTab, type }) => {
    const [activeTab, setActiveTab] = useState("cheap");
    const [isTransitioning, setIsTransitioning] = useState(false);

    if (!resultsByTab || !resultsByTab.cheap ) {
        return null;
    }

    const handleTabChange = (key) => {
        if (key === activeTab) return;
        setIsTransitioning(true);
        setTimeout(() => {
        setActiveTab(key);
        setIsTransitioning(false);
        }, 300); 
    };

    const currentList = resultsByTab[activeTab] || [];

    return (
        <div className="bg-gray-100 text-black py-8 px-4 transition-all">
            <div className="bg-gray-100 text-black py-8 px-4 transition-all">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">
                {type === 1 ? "Chọn địa điểm khởi hành" : "Chọn điểm đến"}
                </h2>

                <div className="flex justify-start gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`px-2 py-1 rounded border transition-all duration-300 ${
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


        {/* Danh sách với hiệu ứng */}
        <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto transform transition-all duration-500 ease-in-out ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
        >
            {currentList.map((flight, index) => (
                <button
                key={index}
                className="bg-white rounded shadow p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                    <h3 className="text-xl font-bold">{flight.name}</h3>
                    <p className="text-sm text-gray-500">Các chuyến bay có giá từ</p>
                    <p className="text-xl font-semibold text-right">
                        {flight.price.toLocaleString()} ₫
                    </p>
                </button>
            ))}
        </div>
        </div>
    );
};

export default FlightResultListType1;
