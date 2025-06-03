import React from "react";

const FlightSearchBarCompact = ({ from, to, onExpandForm, showForm }) => {
  return (
        <button
        onClick={onExpandForm}
        className={`bg-white text-[#071d36] rounded-xl px-8 py-3 flex items-center gap-2 shadow max-w-4xl mx-auto mt-4 w-full hover:shadow-md 
            transition-all duration-500 ease-in-out origin-top overflow-hidden
            ${!showForm ? "opacity-0 scale-y-0 pointer-events-none" : "opacity-100 scale-y-100 pointer-events-auto"}`}
        style={{
            marginTop: "-150px"
        }}
        >
        <span className="text-gray-500">🔍</span>
        <span className="text-sm font-medium text-left">
            {from} – {to} • 8 thg 6 – 15 thg 6 • 1 người lớn
        </span>
        </button>

  );
};

export default FlightSearchBarCompact;
