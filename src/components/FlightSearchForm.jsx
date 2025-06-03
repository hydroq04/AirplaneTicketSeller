import { useState } from "react";
import FlightSearchFormFull from "./FlightSearchFormFull";
import FlightSearchBarCompact from "./FlightSearchBarCompact";

const FlightSearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState("Việt Nam");
  const [to, setTo] = useState("TP.HCM");
  const [showForm, setShowForm] = useState(true);
  const [position, setPosition] = useState(-300)
  

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    const results = [
      { name: "Phú Quốc", price: 2202743 },
      { name: "Nha Trang", price: 2259911 },
      { name: "Đà Lạt", price: 2367695 },
      { name: "Đà Nẵng", price: 2441537 },
      { name: "Hải Phòng", price: 3463410 },
      { name: "Huế", price: 3511645 },
    ];
    setPosition(-580)
    setShowForm(false);
    onSearch(results);
  };

  const handleExpandForm = () => {
    setShowForm(true);
    setPosition(-590)
  };

return (
  <div
    className={`relative z-20 w-full transition-all duration-700 ease-in-out ${
      showForm ? "" : "bg-[#071d36]"
    }`}
    style={{ 
      height: showForm ? "200px" : "100px" , 
      marginTop: `${position}px`
     }}
  >
    <div className="max-w-6xl mx-auto">
        <FlightSearchFormFull
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          handleSwap={handleSwap}
          handleSearch={handleSearch}
          showForm = {showForm}
        />
        <FlightSearchBarCompact from={from} to={to} onExpandForm={handleExpandForm} showForm = {!showForm} />
    </div>
  </div>
);

};

export default FlightSearchForm;
