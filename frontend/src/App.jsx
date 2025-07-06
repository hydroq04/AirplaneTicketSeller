import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightResultList from "./components/FlightResultList";
import LoginModal from "./pages/LoginModal";
import RegionSettingsModal from "./pages/RegionSettingsModal";
import BoughtTicketsList from "./components/BoughtTicketsList";
import FlightDetailPanel from "./components/FlightDetailPanel";
import RevenueReport from "./pages/RevenueReport";
import FlightListAdmin from "./pages/FlightListAdmin";
import CustomerListAdmin from "./pages/CustomerListAdmin";
import RegulationPage from "./pages/RegulationPage";


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
  const [logined, setLogined] = useState(false)
  const [Login, setLogin] = useState(null)
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [info, setInfo] = useState(null)
  const [BoughtList, setBoughtList] = useState([])
  const [showSearch, setShowSearch] = useState(true)
  const [showBought, setShowBought] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [index, setIndex] = useState(1)
  const [user, setUser] = useState({})
  const [showForm, setShowForm] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const [showReportPage, setShowReportPage] = useState(false);
  const [showFlightListAdmin, setShowFlightListAdmin] = useState(false)
  const [showCustomerListAdmin, setShowCustomerListAdmin] = useState(false)
  const [showChangePolicy_, setShowChangePolicy_] = useState(false)

  const setUpLogin = () => {
    if (!logined) {
      setIsLoginOpen(true)
    }
  }
  const resetToHome = () => {
    setShowHome(true);       // hiện trang Home
    setShowSearch(true)
    setFlightResults(null);  // ẩn kết quả tìm kiếm
    setScalMenu(false);      // thu menu lại
    setShowResults(false); 
    setShowBought(false)
    if (methods?.resetFlightSearchForm) {
      methods.resetFlightSearchForm();   // reset lại form input
    }
  };

const Homeadmin = () => {
  setShowHome(true);
  setShowSearch(false);
  setShowResults(false);
  setShowBought(false);
  setShowForm(false);
  setShowPanel(false);
  setIsAdmin(true);
  setShowReportPage(false)
  setShowFlightListAdmin(false)
  setShowCustomerListAdmin(false)
  setShowChangePolicy_(false)
};

  useEffect(() => {
    setLogin({
      setUser,
      setUpLogin,
      setLogined,
      setIsLoginOpen,
      resetToHome,
      setShowResults,
      setIsAdmin,
      setShowHome,
      setBoughtList,
      setShowSearch,
      Homeadmin,
      getUser: () => user,
      isLogin: () => logined
    });
  }, [logined, setLogin]);

  const handleLogout = () => {
    setLogined(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen text-white font-sans">
      {showForm && !showHome && !showBought && isAdmin && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setShowForm(false)}
        />
      )}
      <div  className={`${(showHome || showPanel ||  showReportPage || showBought)?"":"fixed top-0 left-0 w-full z-50 bg-[#071d36]"}`} >
          <Menu 
            ticketCount={BoughtList.length}
            switchToHome={resetToHome}
            switchToHomeAdmin={Homeadmin}
            scale_Menu={scale}
            setIsLoginOpen = {setIsLoginOpen}
            setShowRegionModal = {setShowRegionModal}
            setLogin={Login}
            RegionModel={RegionModel}
            methods = {methods}
            showSearch = {showSearch}
            hidden = {()=>{
              setShowSearch(false)
              setShowResults(false)
              setShowHome(false)
              setShowBought(true)
            }}
            visible={resetToHome}
            logined = {logined}
            user={user}
            onLogout={handleLogout}
            setShowReportPage={setShowReportPage}
            setShowFlightListAdmin={setShowFlightListAdmin}
            setShowCustomerListAdmin = {setShowCustomerListAdmin}
            setShowForm={setShowForm}
            setIsAdmin = {setIsAdmin}
            setShowChangePolicy_ = {setShowChangePolicy_}
          />
          
          <BoughtTicketsList
            showBought={showBought} 
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            user={user}
          />

          <Home isVisible={showHome} />
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              showSearch ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none h-0"
            }`}
          >
            <FlightSearchForm
              onSearch={(results) => {
                setFlightResults(results);
                setShowHome(false);
                setScalMenu(true);
                setShowResults(true);
              }}
              ChooseType={(from, to, date) => {
                let country = "Việt Nam";
                if (RegionModel?.getCountry) {
                  country = RegionModel.getCountry();
                }
                setBookingRoute({ from, to, departureDate: date });
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
              setInfo={setInfo}
              isAdmin = {isAdmin}
              showBought={showBought}
              showForm={showForm}
              setShowForm={setShowForm}
            />
          </div>
      </div>
      {(showHome || showPanel)? (<div className="h-0"></div>):(<div className="h-[210px]" />)}
      
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showResults ? "opacity-100 scale-100 max-h-[9999px]" : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
        }`}
      >
        <FlightResultList
          resultsByTab={flightResults}
          type={chooseType}
          setToAndSearch={(to) => {
            if (!methods) return;
            setTimeout(() => {
              methods.handleSearchWithTo(to);
              const { from } = methods.getFromTo();
              const {departureDate} = methods.getDepartureDate();
              setBookingRoute({ from, to, departureDate });
            }, 0);
          }}
          bookingRoute={bookingRoute}
          Methods={methods}
          setLogin={Login}
          favorites={favorites}
          setFavorites={setFavorites}
          setSelectedFlight={setSelectedFlight}
        />
      </div>

      <LoginModal 
      isOpen={isLoginOpen} 
      onClose={() => setIsLoginOpen(false)}
      setLogin={Login} 
      />

      <RegionSettingsModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        exposeRegionModel = {setRegionModel}
      />
      
      <FlightDetailPanel
        showPanel = {showPanel}
        setShowPanel = {setShowPanel}
        index={index}
        setIndex={setIndex}
        selectedFlight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
        info={info}
        setBoughtList={setBoughtList}
        BoughtList={BoughtList}
        setLogin={Login}
        user = {user}
      />
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showReportPage ? "opacity-100 scale-100 max-h-[9999px]" : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
        }`} 
      >
        <RevenueReport />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showFlightListAdmin ? "opacity-100 scale-100 max-h-[9999px]" : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
        }`} 
      >
        <FlightListAdmin />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showChangePolicy_ ? "opacity-100 scale-100 max-h-[9999px]" : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
        }`} 
      >
        <RegulationPage showChangePolicy_={showChangePolicy_} />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          showCustomerListAdmin ? "opacity-100 scale-100 max-h-[9999px]" : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
        }`} 
      >
        <CustomerListAdmin showCustomerListAdmin={showCustomerListAdmin} />
      </div>
    </div>
  );
}

export default App;
