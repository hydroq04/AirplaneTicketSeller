import React, { useState, useEffect } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

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
        const res = await fetch(`${API_Url}/api/users`);
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
      </div>

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
