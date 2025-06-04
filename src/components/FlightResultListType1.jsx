import React, { useState } from "react";

const tabs = [
  { key: "cheap", label: "Chuyến bay rẻ nhất" },
  { key: "direct", label: "Chuyến bay thẳng" },
  { key: "all", label: "Mọi địa điểm hiện có" },
];

const FlightResultListType1 = ({ resultsByTab, type, Methods }) => {
    const [activeTab, setActiveTab] = useState("cheap");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [clickedLocal, setClickedLocal] = useState(null);
    const [loadingLocal, setLoadingLocal] = useState(false);


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

    const handleChooseLocal = (local) => {
    if (loadingLocal) return; // tránh double click
    setClickedLocal(local);
    setLoadingLocal(true);

    setTimeout(() => {
        if (type === 1) Methods.handleSearchWithFrom(local);
        else if (type === 2) Methods.handleSearchWithTo(local);
        setLoadingLocal(false);
    }, 800); // delay để thấy loading rõ hơn
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
                onClick={() => handleChooseLocal(flight.name)}
                key={index}
                disabled={loadingLocal}
                className={`bg-white rounded shadow p-4 transition-all duration-300 transform 
                    flex flex-col justify-between h-full text-left
                    ${clickedLocal === flight.name ? "ring-2 ring-blue-600 scale-105" : ""}
                    ${loadingLocal ? "opacity-60 pointer-events-none" : "hover:shadow-lg hover:scale-[1.02]"}`}
                >
                <h3 className="text-xl font-bold mb-1">{flight.name}</h3>
                <p className="text-sm text-gray-500">Các chuyến bay có giá từ</p>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xl font-semibold text-right">
                    {flight.price.toLocaleString()} ₫
                    </p>
                    {clickedLocal === flight.name && loadingLocal && (
                    <div className="loader ml-2" />
                    )}
                </div>
                </button>
            ))}
        </div>
        </div>
    );
};

export default FlightResultListType1;