import React from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import FlightSearchForm from "./components/FlightSearchForm";

function App() {
  return (
    <div className="min-h-screen bg-sky-900 text-white font-sans">
      <Menu />
      <Home />
      <FlightSearchForm />
    </div>
  );
}

export default App;