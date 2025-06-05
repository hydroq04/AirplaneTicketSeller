import React from "react";
import FlightResultListType0 from "./FlightResultListType0";
import FlightResultListType1 from "./FlightResultListType1";
import FlightBookingList from "./FlightBookingList";

const FlightResultList = ({ resultsByTab, type, setToAndSearch, bookingRoute, Methods, setLogin, favorites, setFavorites, info, setBoughtList, BoughtList }) => {
  switch (type) {
    case 0:
      return (
        <FlightResultListType0
          resultsByTab={resultsByTab}
          setToAndSearch={setToAndSearch}
        />
      );
    case 1:
    case 2:
      return (
        <FlightResultListType1
          resultsByTab={resultsByTab}
          type={type}
          Methods={Methods}
        />
      );
    case 3:
      const { from, to } = bookingRoute;
      return (
        <FlightBookingList
          from={from}
          to={to}
          setLogin = {setLogin}
          favorites={favorites}
          setFavorites={setFavorites}
          info={info}
          setBoughtList={setBoughtList}
          BoughtList = {BoughtList}
        />
      );
    default:
      return null;
  }
};

export default FlightResultList;
