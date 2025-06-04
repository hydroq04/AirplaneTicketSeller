import React from "react";

const FlightSearchFormFull = ({ from, to, setFrom, setTo, handleSwap, handleSearch, showForm }) => {
  return (
        <section
        className={`bg-[#061c37] text-white p-4 rounded-xl transition-all duration-700 ease-in-out 
            overflow-hidden origin-top 
            ${showForm ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}`}
        >

      {/* Tabs */}
      <div className="flex gap-4 mb-4 text-sm font-medium">
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" defaultChecked />
          <span>Khứ hồi</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" />
          <span>Một chiều</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="tripType" />
          <span>Nhiều thành phố</span>
        </label>
      </div>

      {/* Form main */}
      <div className="flex flex-col md:flex-row gap-2 text-black">
        <div className="relative flex items-center gap-0 bg-white rounded-xl overflow-hidden flex-grow">
          <div className="flex-1 p-4 border-r">
            <label className="text-xs text-gray-500 block mb-1">Từ</label>
            <input
              type="text"
              className="text-black w-full outline-none"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="absolute left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
          >
            ⇄
          </button>

          <div className="flex-1 p-4 border-l pl-6">
            <label className="text-xs text-gray-500 block mb-1">Đến</label>
            <input
              type="text"
              className="text-black w-full outline-none"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        {/* <input type="date" defaultValue="2025-06-08" className="p-3 rounded-md" /> */}
        <input type="date" defaultValue="2025-06-15" className="p-3 rounded-md" />
        <input
          type="text"
          value="1 người lớn, Phổ thông"
          readOnly
          className="p-3 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 rounded-md hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Thêm các sân bay gần đây</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Chỉ các chuyến bay thẳng</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Thêm các sân bay gần đây</span>
        </label>
      </div>
    </section>
  );
};

export default FlightSearchFormFull;
