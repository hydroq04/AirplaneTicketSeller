import React from "react";
import Menu from '../components/Menu';
import PassengerClassSelector from '../components/PassengerClassSelector';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [showRegionModal, setShowRegionModal] = React.useState(false);
  const RegionModel = { getLCC: () => ({ language: "VN", country: "Việt Nam", currency: "VND" }) };
  const user = { name: "User" };
  const ticketCount = 2;
  const logined = !!localStorage.getItem('token');
  const avatarUrl = "https://i.pravatar.cc";

  const switchToHome = () => {};
  const showSearch = () => {};
  const hidden = () => {};
  const visible = () => {};
  const onLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div>
      <Menu
        setIsLoginOpen={setIsLoginOpen}
        setShowRegionModal={setShowRegionModal}
        user={user}
        ticketCount={ticketCount}
        RegionModel={RegionModel}
        switchToHome={switchToHome}
        showSearch={showSearch}
        hidden={hidden}
        visible={visible}
        logined={logined}
        avatarUrl={avatarUrl}
        onLogout={onLogout}
      />
      <div className="p-4">
        <div id="revenue">
          <PassengerClassSelector
            value={{ adults: 1, children: 0, travelClass: "Phổ thông" }}
            onChange={() => {}}
            onClose={() => {}}
          />
        </div>
        <div id="flights" className="mt-6">
          <PassengerClassSelector
            value={{ adults: 1, children: 0, travelClass: "Phổ thông" }}
            onChange={() => {}}
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
