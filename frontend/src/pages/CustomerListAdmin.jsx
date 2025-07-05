import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const CustomerListAdmin = ({ showCustomerListAdmin }) => {
  const [customers, setCustomers] = useState([]);
  const [editingEmail, setEditingEmail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCustomer, setNewCustomer] = useState({
    email: "",
    name: "",
    age: "",
    dob: "",
    address: "",
    bankInfo: "",
    tickets: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          // Map API user to table customer fields
          const mapped = data.users.map((u) => ({
            email: u.email,
            name: [u.firstName, u.lastName].filter(Boolean).join(" "),
            age: u.dob ? new Date().getFullYear() - new Date(u.dob).getFullYear() : "",
            dob: u.dob ? u.dob.slice(0, 10) : "",
            address: u.address || "",
            bankInfo: u.bankInfo || "",
            tickets: u.tickets || 0,
          }));
          setCustomers(mapped);
        } else {
          setError("Không thể tải danh sách khách hàng");
        }
      } catch (err) {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showCustomerListAdmin]);

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
      tickets: 0,
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
      c.name?.toLowerCase().includes(searchName.toLowerCase()) &&
      c.email?.toLowerCase().includes(searchEmail.toLowerCase())
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

      {/* Loading/Error */}
      {loading && <p>⏳ Đang tải danh sách khách hàng...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
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
                    {c.tickets || 0}
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
                      onClick={() => alert("Xem chi tiết khách hàng")}
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
      )}
    </div>
  );
};

export default CustomerListAdmin;
