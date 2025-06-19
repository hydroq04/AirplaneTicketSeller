import ReactDOM from "react-dom";

const PassengerClassPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default PassengerClassPortal;
