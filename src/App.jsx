import React, { useState } from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightResultList from "./components/FlightResultList";

function App() {
  const [flightResults, setFlightResults] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [scale, setScalMenu] = useState(false);
  const [chooseType, SetChooseType] = useState(1);
  const [methods, setMethods] = useState(null);
  const [isWaitingResult, setIsWaitingResult] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);


  return (
    <div className="min-h-screen text-white font-sans">
      <Menu scale_Menu={scale} />
      <Home isVisible={showHome} />

      <FlightSearchForm
        onSearch={(results) => {
          setFlightResults(results);
          setShowHome(false);
          setScalMenu(true);
          setIsWaitingResult(true); // cho phép hiển thị FlightResultList
        }}
        ChooseType={(from, to) => {
          if (from === "Việt Nam" && to === "Việt Nam") {
            SetChooseType(0);
          } else if (from === "Việt Nam" || to === "Việt Nam") {
            if (from === "Việt Nam") SetChooseType(1);
            else SetChooseType(2);
          } else {
            SetChooseType(3);
          }
        }}
        exposeMethods={setMethods}
      />

      {/* ✅ Chỉ hiển thị khi có kết quả và không bị ẩn tạm thời */}
      {flightResults && isWaitingResult && (
        <FlightResultList
          resultsByTab={flightResults}
          type={chooseType}
          setToAndSearch={(to) => {
            if (!methods) return;

            setIsWaitingResult(false); // Tạm ẩn kết quả để tránh chớp

            // Delay nhỏ rồi thực hiện chuyển
            setTimeout(() => {
              methods.handleSearchWithTo(to);

              // Cho hiện lại kết quả sau khi đã cập nhật xong
              setTimeout(() => {
                setIsWaitingResult(true);
              }, 100); // bạn có thể tăng lên nếu vẫn thấy nháy
            }, 0);
          }}
        />
      )}
    </div>
  );
}

export default App;
