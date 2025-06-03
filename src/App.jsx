import React, { useState } from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import FlightSearchForm from "./components/FlightSearchForm";

function App() {

  const [flightResults, setFlightResults] = useState([]);
  const [showHome, setShowHome] = useState(true);
  const [scale, setScalMenu] = useState(false)
  return (
    <div className="min-h-screen  text-white font-sans">
      <Menu scale_Menu={scale} />
      <Home isVisible={showHome} />
      <FlightSearchForm onSearch={(results) => {
        setFlightResults(results)
        setShowHome(false)
        setScalMenu(true)
      }} />

      {flightResults.length > 0 && (
        <div className="bg-gray-100 text-black py-8 px-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Chọn địa điểm khởi hành</h2>
          <div className="flex justify-center gap-2 mb-6">
            <button className="bg-[#071d36] text-white px-4 py-2 rounded">Chuyến bay rẻ nhất</button>
            <button className="border px-4 py-2 rounded">Chuyến bay thẳng</button>
            <button className="border px-4 py-2 rounded">Mọi địa điểm hiện có</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {flightResults.map((flight, index) => (
              <div key={index} className="bg-white rounded shadow p-4">
                <h3 className="text-xl font-bold">{flight.name}</h3>
                <p className="text-sm text-gray-500">Các chuyến bay có giá từ</p>
                <p className="text-xl font-semibold text-right">
                  {flight.price.toLocaleString()} ₫
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
