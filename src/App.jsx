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
  const [bookingRoute, setBookingRoute] = useState(null);


  return (
    <div className="min-h-screen text-white font-sans">
      <Menu scale_Menu={scale} />
      <Home isVisible={showHome} />

      <FlightSearchForm
        onSearch={(results) => {
          setFlightResults(results);
          setShowHome(false);
          setScalMenu(true);
        }}
        ChooseType={(from, to) => {
          setBookingRoute({ from, to });
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

      <FlightResultList
        resultsByTab={flightResults}
        type={chooseType}
        setToAndSearch={(to) => {
          if (!methods) return;
          setTimeout(() => {
            methods.handleSearchWithTo(to);
            const { from } = methods.getFromTo();
            setBookingRoute({ from, to });
            setTimeout(() => {
            }, 100);
          }, 0);
        }}
        bookingRoute ={bookingRoute}
        Methods={methods}
      />
    </div>
  );
}

export default App;
