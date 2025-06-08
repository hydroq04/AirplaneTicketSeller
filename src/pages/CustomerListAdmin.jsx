import React, { useState } from "react";
import { Pencil, Trash2, Eye, PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const initialFlights = [
  { id: "#01", airline: "Vietjet Air", timeFrom: "21:05", timeTo: "22:05", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 42 },
  { id: "#02", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 2551000, passengerCount: 65 },
  { id: "#03", airline: "Vietjet Air", timeFrom: "05:30", timeTo: "06:30", codeFrom: "CXR", codeTo: "SGN", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 38 },
  { id: "#04", airline: "Vietnam Airlines", timeFrom: "08:55", timeTo: "10:00", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 3296000, passengerCount: 78 },
  { id: "#05", airline: "Vietjet Air", timeFrom: "12:40", timeTo: "13:40", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 2489539, passengerCount: 50 },
  { id: "#06", airline: "Vietjet Air", timeFrom: "21:05", timeTo: "22:05", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 44 },
  { id: "#07", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "CXR", codeTo: "SGN", duration: "1g 05", type: "Trực tiếp", price: 2551000, passengerCount: 61 },
  { id: "#08", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 3296000, passengerCount: 75 }
];

const initialCustomers = [
  {
    email: "alice@example.com",
    name: "Alice",
    age: 25,
    dob: "2000-01-01",
    address: "Hà Nội",
    bankInfo: "VCB - 123456789",
    tickets: [{id: 1, 
      flight: initialFlights[1] , 
      date: "2025-06-10",
      pd: {
        adults: 2,
        children: 1,
        travelClass: "Phổ thông"
      }}, 
      {id: 2, 
      flight: initialFlights[3] , 
      date: "2025-06-10",
      pd: {
        adults: 2,
        children: 1,
        travelClass: "Phổ thông"
      }
      }],
  },
  {
    email: "alex@alpha.com",
    name: "Alex",
    age: 26,
    dob: "1999-08-20",
    address: "Nam Định",
    bankInfo: "MB - 222333444",
    tickets: [],
  },
  {
    email: "amanda@flower.com",
    name: "Amanda",
    age: 24,
    dob: "2001-02-14",
    address: "Quảng Nam",
    bankInfo: "ACB - 111222333",
    tickets: [],
  },
  {
    email: "bob@example.com",
    name: "Bob",
    age: 30,
    dob: "1995-05-10",
    address: "TP.HCM",
    bankInfo: "TCB - 987654321",
    tickets: [],
  },
  {
    email: "brian@beta.com",
    name: "Brian",
    age: 31,
    dob: "1994-04-22",
    address: "Long An",
    bankInfo: "VCB - 444555666",
    tickets: [],
  },
  {
    email: "bella@beauty.vn",
    name: "Bella",
    age: 27,
    dob: "1997-07-07",
    address: "Vĩnh Long",
    bankInfo: "BIDV - 999888777",
    tickets: [],
  },
  {
    email: "charlie@domain.com",
    name: "Charlie",
    age: 28,
    dob: "1997-03-15",
    address: "Đà Nẵng",
    bankInfo: "ACB - 654321987",
    tickets: [],
  },
  {
    email: "chloe@cloud.com",
    name: "Chloe",
    age: 23,
    dob: "2002-12-01",
    address: "Đồng Nai",
    bankInfo: "Techcombank - 1122338899",
    tickets: [],
  },
  {
    email: "catherine@cafe.vn",
    name: "Catherine",
    age: 29,
    dob: "1996-10-10",
    address: "Bình Định",
    bankInfo: "Sacombank - 5566778899",
    tickets: [],
  },
  {
    email: "david@dev.com",
    name: "David",
    age: 33,
    dob: "1992-06-06",
    address: "Hà Nam",
    bankInfo: "Agribank - 1010101010",
    tickets: [],
  },
];


const CustomerListAdmin = ({setShowCustomerListAdmin,  setBoughtList, setShowBought}) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editingEmail, setEditingEmail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [newCustomer, setNewCustomer] = useState({
    email: "",
    name: "",
    age: "",
    dob: "",
    address: "",
    bankInfo: "",
    tickets: [],
  });

  const handleAdd = () => {
    if (!newCustomer.email || !newCustomer.name) return alert("Thiếu thông tin");
    setCustomers([...customers, newCustomer]);
    setNewCustomer({
      email: "",
      name: "",
      age: "",
      dob: "",
      address: "",
      bankInfo: "",
      tickets: [],
    });
    setShowForm(false);
  };

  const handleDelete = (email) => {
    if (confirm("Xác nhận xoá khách hàng?")) {
      setCustomers(customers.filter((c) => c.email !== email));
    }
  };

  const handleEdit = (email) => {
    setEditingEmail(email);
  };

  const handleSave = (email, field, value) => {
    setCustomers((prev) =>
      prev.map((c) => (c.email === email ? { ...c, [field]: value } : c))
    );
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchName.toLowerCase()) &&
      c.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👥 Thông tin khách hàng</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          {showForm ? "Đóng lại" : "Thêm khách hàng"}
        </button>
      </div>

      {/* Form thêm khách hàng */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-black gap-4 bg-gray-50 p-4 rounded-lg border">
              {["email", "name", "age", "dob", "address", "bankInfo"].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={newCustomer[field]}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, [field]: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
              <button
                onClick={handleAdd}
                className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                ➕ Xác nhận thêm khách hàng
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tìm kiếm */}
      <div className="flex text-black flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="🔍 Tìm theo email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Danh sách */}
      <div className="overflow-auto border rounded-xl shadow bg-white text-black">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Tuổi</th>
              <th className="px-4 py-2">Ngày sinh</th>
              <th className="px-4 py-2">Địa chỉ</th>
              <th className="px-4 py-2">Ngân hàng</th>
              <th className="px-4 py-2">🎫 Vé</th>
              <th className="px-4 py-2">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr
                key={c.email}
                className={`border-t ${editingEmail === c.email ? "bg-yellow-50" : ""}`}
              >
                {["email", "name", "age", "dob", "address", "bankInfo"].map((field) => (
                  <td key={field} className="px-4 py-2">
                    {editingEmail === c.email ? (
                      <input
                        value={c[field]}
                        onChange={(e) => handleSave(c.email, field, e.target.value)}
                        className="border border-gray-400 p-1 px-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="text-gray-900">{c[field]}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 text-center font-semibold text-blue-600">
                  {c.tickets.length}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editingEmail === c.email ? (
                    <button
                      onClick={() => setEditingEmail(null)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✔
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(c.email)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c.email)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => {
                       setShowCustomerListAdmin(false)
                       setBoughtList(c.tickets)
                       setShowBought(true)
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerListAdmin;
