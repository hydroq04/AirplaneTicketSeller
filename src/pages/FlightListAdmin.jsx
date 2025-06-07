// File: FlightListAdmin.jsx
import React, { useState } from "react";
import { Pencil, Trash2, PlusCircle, Check, X } from "lucide-react";
import "tailwindcss/tailwind.css";

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

function FlightListAdmin() {
  const [flights, setFlights] = useState(initialFlights);
  const [newFlight, setNewFlight] = useState({
    id: "", airline: "", timeFrom: "", timeTo: "", codeFrom: "", codeTo: "", duration: "", type: "", price: 0, passengerCount: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchAirline, setSearchAirline] = useState("");

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xoá chuyến bay này?")) {
      setFlights(flights.filter(f => f.id !== id));
    }
  };

  const handleEditChange = (id, field, value) => {
    setFlights(flights.map(f =>
      f.id === id ? { ...f, [field]: ['price', 'passengerCount'].includes(field) ? +value : value } : f
    ));
  };

  const handleSaveEdit = () => setEditingId(null);

  const handleAddFlight = () => {
    setFlights([...flights, newFlight]);
    setNewFlight({ id: "", airline: "", timeFrom: "", timeTo: "", codeFrom: "", codeTo: "", duration: "", type: "", price: 0, passengerCount: 0 });
    setShowForm(false);
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.id.toLowerCase().includes(searchId.toLowerCase()) &&
      f.airline.toLowerCase().includes(searchAirline.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto text-black animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 animate-slideUp">✈️ Danh sách chuyến bay</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
          <PlusCircle className="w-5 h-5" /> Thêm chuyến bay
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input type="text" placeholder="🔍 Mã chuyến" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="p-2 border rounded w-full sm:w-1/2" />
        <input type="text" placeholder="🔍 Hãng" value={searchAirline} onChange={(e) => setSearchAirline(e.target.value)} className="p-2 border rounded w-full sm:w-1/2" />
      </div>

      {showForm && (
        <div className="mb-4 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded animate-fadeIn">
          {Object.keys(newFlight).map(key => (
            <input key={key} type={['price', 'passengerCount'].includes(key) ? 'number' : 'text'}
              placeholder={key} value={newFlight[key]}
              onChange={(e) => setNewFlight({ ...newFlight, [key]: e.target.value })}
              className="p-2 border rounded" />
          ))}
          <button onClick={handleAddFlight} className="col-span-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            ➕ Xác nhận thêm chuyến bay
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredFlights.map((f) => (
          <div key={f.id} className="p-4 border rounded shadow-sm animate-slideUp transition-all duration-300">
            {editingId === f.id ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(f).map(([key, val]) => (
                  key !== 'id' ? (
                    <input
                      key={key}
                      value={val}
                      onChange={(e) => handleEditChange(f.id, key, e.target.value)}
                      className="p-2 border rounded text-sm"
                      placeholder={key}
                    />
                  ) : <div key={key} className="text-sm font-bold text-gray-700 col-span-full">Mã chuyến: {val}</div>
                ))}
                <div className="col-span-full flex gap-2 justify-end mt-2">
                  <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  <div className="text-sm text-gray-500">Mã chuyến: <span className="text-gray-900 font-medium">{f.id}</span></div>
                  <div className="text-gray-800 font-semibold w-32">{f.airline}</div>
                  <div className="text-sm text-gray-700">{f.codeFrom} → {f.codeTo}</div>
                  <div className="text-sm text-gray-700">{f.timeFrom} - {f.timeTo}</div>
                  <div className="text-sm text-gray-700">{f.duration} • {f.type}</div>
                  <div className="text-sm text-indigo-600">{f.passengerCount} hành khách</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-600 font-bold text-lg">{f.price.toLocaleString()} đ</div>
                  <button onClick={() => setEditingId(f.id)} className="text-blue-500 hover:text-blue-700"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightListAdmin;
