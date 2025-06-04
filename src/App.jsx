import React, { useState } from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightResultList from "./components/FlightResultList";
import LoginModal from "./pages/LoginModal";
import RegionSettingsModal from "./pages/RegionSettingsModal";


function App() {
  const [flightResults, setFlightResults] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [scale, setScalMenu] = useState(false);
  const [chooseType, SetChooseType] = useState(1);
  const [methods, setMethods] = useState(null);
  const [bookingRoute, setBookingRoute] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [RegionModel, setRegionModel] = useState(null)


  return (
    <div className="min-h-screen text-white font-sans">
      <Menu 
        scale_Menu={scale}
        setIsLoginOpen = {setIsLoginOpen}
        setShowRegionModal = {setShowRegionModal}
        RegionModel={RegionModel}
       />
      <Home isVisible={showHome} />

      <FlightSearchForm
        onSearch={(results) => {
          setFlightResults(results);
          setShowHome(false);
          setScalMenu(true);
        }}
        ChooseType={(from, to) => {
          let country= "Việt Nam";
          if (RegionModel?.getCountry){
            country=RegionModel.getCountry()
          }
          setBookingRoute({ from, to });
          if (from === country && to === country) {
            SetChooseType(0);
          } else if (from === country || to === country) {
            if (from === country) SetChooseType(1);
            else SetChooseType(2);
          } else {
            SetChooseType(3);
          }
        }}
        exposeMethods={setMethods}
        RegionModel={RegionModel}
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


      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegionSettingsModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        exposeRegionModel = {setRegionModel}
      />
    </div>
  );
}

export default App;
