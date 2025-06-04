// components/FlightResultList.jsx
import React from "react";
import FlightResultListType0 from "./FlightResultListType0";
import FlightResultListType1 from "./FlightResultListType1";
// import FlightResultListType2 from "./FlightResultListType2";


const FlightResultList = ({ resultsByTab, type, setToAndSearch }) => {
  if (!resultsByTab || !resultsByTab.cheap) return null;

  switch (type) {
    case 0:
      return <FlightResultListType0 resultsByTab={resultsByTab} setToAndSearch={setToAndSearch} />;
    case 1:
      return <FlightResultListType1 resultsByTab={resultsByTab} type={type} />;
    case 2:
      return <FlightResultListType1 resultsByTab={resultsByTab} type={type}/>;
    //case 3:
    //   return <FlightResultListType2 resultsByTab={resultsByTab} />;
    default:
      return null;
  }
};

export default FlightResultList;
