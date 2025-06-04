import { useState, useEffect } from "react";
import FlightSearchFormFull from "./FlightSearchFormFull";
import FlightSearchBarCompact from "./FlightSearchBarCompact";

const FlightSearchForm = ({ onSearch, ChooseType, exposeMethods }) => {
  const [from, setFrom] = useState("Việt Nam");
  const [to, setTo] = useState("TP.HCM");
  const [showForm, setShowForm] = useState(true);
  const [position, setPosition] = useState(-300);

  const handleSearch = () => {
    runSearch(from, to);
  };

  // 👉 Hàm này dùng khi muốn truyền to mới từ bên ngoài
  const handleSearchWithTo = (newTo) => {
    setTo(newTo);
    runSearch(from, newTo); // dùng luôn to mới thay vì đợi state cập nhật
  };

  // 👉 Tách phần xử lý chung để dùng cho cả 2 trường hợp
  const runSearch = (currentFrom, currentTo) => {
    let results = null;

    if (currentFrom === "Việt Nam" && currentTo === "Việt Nam") {
      results = {
        cheap: [
          { name: "Nha Trang", price: 1571965 },
          { name: "Phú Quốc", price: 1908349 },
          { name: "Thành Phố Hồ Chí Minh", price: 1910720 },
          { name: "Đà Lạt", price: 1945989 }
        ],
        direct: [
          { name: "Nha Trang", price: 1571965 },
          { name: "Đà Nẵng", price: 2208872 },
          { name: "Pleiku", price: 2221024 },
          { name: "Hà Nội", price: 2292450 }
        ],
        suggestions: [
          { name: "Côn Đảo", price: 3375102 },
          { name: "Hải Phòng", price: 4043128 }
        ]
      };
    } else if (currentFrom === "Việt Nam") {
      results = {
        cheap: [
          { name: "Phú Quốc", price: 2200000 },
          { name: "Đà Lạt", price: 2300000 },
          { name: "Đà Nẵng", price: 2500000 },
        ],
        direct: [
          { name: "Hải Phòng", price: 3400000 },
          { name: "Nha Trang", price: 2500000 },
        ],
        all: [
          { name: "Phú Quốc", price: 2200000 },
          { name: "Nha Trang", price: 2500000 },
          { name: "Huế", price: 3500000 },
        ],
      };
    } else if (currentTo === "Việt Nam") {
      results = {
        cheap: [
          { name: "Phú Quốc", price: 2200000 },
          { name: "Đà Lạt", price: 2300000 },
          { name: "Đà Nẵng", price: 2500000 },
          { name: "Quảng Nam", price: 5000000 }
        ],
        direct: [
          { name: "Hải Phòng", price: 3400000 },
          { name: "Nha Trang", price: 2500000 },
        ],
        all: [
          { name: "Phú Quốc", price: 2200000 },
          { name: "Nha Trang", price: 2500000 },
          { name: "Huế", price: 3500000 },
        ],
      };
    }
    setPosition(-580);
    setShowForm(false);
    onSearch(results);
    ChooseType(currentFrom, currentTo);
  };

  // 👉 Cho component cha lấy được method này
  useEffect(() => {
    if (exposeMethods) {
      exposeMethods({
        handleSearch,
        setTo,
        handleSearchWithTo,
        getFromTo: () => ({ from, to }),
      });
    }
  }, [from, to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleExpandForm = () => {
    setShowForm(true);
    setPosition(-590);
  };

  return (
    <div
      className={`relative z-20 w-full transition-all duration-700 ease-in-out ${
        showForm ? "" : "bg-[#071d36]"
      }`}
      style={{
        height: showForm ? "200px" : "100px",
        marginTop: `${position}px`,
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
          showForm={showForm}
        />
        <FlightSearchBarCompact
          from={from}
          to={to}
          onExpandForm={handleExpandForm}
          showForm={!showForm}
        />
      </div>
    </div>
  );
};

export default FlightSearchForm;
