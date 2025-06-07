import React, { useEffect, useRef, useState } from "react";

const PassengerClassSelector = ({ value, onChange, onClose, position = "top" }) => {
  const [adults, setAdults] = useState(value?.adults || 1);
  const [children, setChildren] = useState(value?.children || 0);
  const [travelClass, setTravelClass] = useState(value?.travelClass || "Phổ thông");
  const [isVisible, setIsVisible] = useState(true);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ref = useRef();

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        hideWithAnimation();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

   // Vai trò Fetch
  useEffect(() => {
    const simulateRoleFetch = async () => {
      try {
        const simulatedToken = localStorage.getItem('token');
        if (simulatedToken) {
          const simulatedRole = simulatedToken.includes('admin') ? 'admin' : 'user';
          setRole(simulatedRole);
        } else {
          setRole('user');
        }
      } catch (err) {
        setError('Failed to load role information');
      } finally {
        setLoading(false);
      }
    };
    simulateRoleFetch();
  }, []);

  // Xử lý đăng ký
  const handleRegister = (e) => {
    e.preventDefault();
    try {
      const userData = { username, email, password, role: selectedRole };
      console.log('Registration data:', userData);
      localStorage.setItem('token', selectedRole === 'admin' ? 'admin-token' : 'user-token');
      setRole(selectedRole);
      setUsername("");
      setEmail("");
      setPassword("");
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  // Animate hide
  const hideWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  // Trigger thay đổi lên cha
  useEffect(() => {
    onChange?.({ adults, children, travelClass });
  }, [adults, children, travelClass]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div
      ref={ref}
      className={`
        relative w-[340px] bg-white text-black p-5 rounded-2xl shadow-2xl 
        transition-all duration-200 ease-out z-50
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      {/* Mũi nhọn */}
      <div
        className={`
          absolute w-4 h-4 bg-white rotate-45 shadow-md
          ${position === "top" ? "bottom-[-6px] left-1/2 -translate-x-1/2" : ""}
          ${position === "bottom" ? "top-[-6px] left-1/2 -translate-x-1/2" : ""}
        `}
      />

      {/* Nội dung chọn */}
      <div>
        {role === 'admin' ? (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <input
             
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <select
                value={selectedRole}
                onChange={(e)  => setSelectedRole(e.target.value)}
                className="border p-2 mb-2 w-full rounded"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                Register
              </button>
            </form>
            <RevenueReport />
            <FlightDetails />
          </div>
     ) : (
      <div>
        {/* Chọn hạng khoang */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">Hạng khoang</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-blue-500"
          >
            <option>Phổ thông</option>
            <option>Phổ thông đặc biệt</option>
            <option>Thương gia</option>
            <option>Hạng nhất</option>
          </select>
        </div>

        {/* Người lớn / trẻ em */}
        {[{ label: "Người lớn", age: "Từ 18 tuổi trở lên", value: adults, set: setAdults, min: 1 },
          { label: "Trẻ em", age: "Từ 0 đến 17 tuổi", value: children, set: setChildren, min: 0 }]
          .map((item, i) => (
            <div key={i} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.age}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={item.value <= item.min}
                  onClick={() => item.set(item.value - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-lg font-medium hover:bg-gray-300 disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-[20px] text-center">{item.value}</span>
                <button
                  onClick={() => item.set(item.value + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full text-lg font-medium hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}

        <p className="text-xs text-gray-500 mt-3 leading-snug">
          Tuổi của bạn phải hợp lệ khi đặt vé. Vui lòng kiểm tra với hãng trước khi đặt.
        </p>

        {/* Nút Xong */}
        <div className="flex justify-end mt-4">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={hideWithAnimation}
            className="text-blue-600 font-semibold hover:underline"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
// Thành phần đặc thù cho admin
const RevenueReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const simulateRevenueFetch = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const simulatedReport = {
          totalRevenue: 500000,
          monthlyBreakdown: { June: 150000, May: 350000 },
        };
        setReport(simulatedReport);
      } catch (err) {
        setError('Failed to load revenue report');
      } finally {
        setLoading(false);
      }
    };
    simulateRevenueFetch();
  }, []);

  if (loading) return <div className="text-center p-4">Loading revenue data...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Revenue Report</h2>
      {report && (
        <div className="text-gray-600">
          <p>Total Revenue: ${report.totalRevenue}</p>
          <p>June: ${report.monthlyBreakdown.June}</p>
          <p>May: ${report.monthlyBreakdown.May}</p>
        </div>
      )}
    </div>
  );
};

const FlightDetails = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const simulateFlightFetch = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const simulatedFlights = [
          {
            id: 'FL001',
            passengerCount: 150,
            passengerInfo: { avgAge: 35, classDistribution: { Economy: 120, Business: 30 } },
          },
          {
            id: 'FL002',
            passengerCount: 200,
            passengerInfo: { avgAge: 40, classDistribution: { Economy: 160, Business: 40 } },
          },
        ];
        setFlights(simulatedFlights);
      } catch (err) {
        setError('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };
    simulateFlightFetch();
  }, []);

  if (loading) return <div className="text-center p-4">Loading flight data...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Flight Details</h2>
      {flights.length > 0 ? (
        <ul className="text-gray-600">
          {flights.map((flight) => (
            <li key={flight.id} className="border-b py-2">
              <p>Flight ID: {flight.id}</p>
              <p>Passengers: {flight.passengerCount}</p>
              <p>Passenger Info: {JSON.stringify(flight.passengerInfo)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No flight data available</p>
      )}
    </div>
  );
};
export default PassengerClassSelector;
