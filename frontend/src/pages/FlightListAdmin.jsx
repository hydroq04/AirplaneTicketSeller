import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle, Check, X } from "lucide-react";
import "tailwindcss/tailwind.css";

// const initialFlights = [
//   { id: "#01", airline: "Vietjet Air", timeFrom: "21:05", timeTo: "22:05", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 42 },
//   { id: "#02", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 2551000, passengerCount: 65 },
//   { id: "#03", airline: "Vietjet Air", timeFrom: "05:30", timeTo: "06:30", codeFrom: "CXR", codeTo: "SGN", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 38 },
//   { id: "#04", airline: "Vietnam Airlines", timeFrom: "08:55", timeTo: "10:00", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 3296000, passengerCount: 78 },
//   { id: "#05", airline: "Vietjet Air", timeFrom: "12:40", timeTo: "13:40", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 2489539, passengerCount: 50 },
//   { id: "#06", airline: "Vietjet Air", timeFrom: "21:05", timeTo: "22:05", codeFrom: "SGN", codeTo: "CXR", duration: "1g", type: "Trực tiếp", price: 1570780, passengerCount: 44 },
//   { id: "#07", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "CXR", codeTo: "SGN", duration: "1g 05", type: "Trực tiếp", price: 2551000, passengerCount: 61 },
//   { id: "#08", airline: "Vietnam Airlines", timeFrom: "18:40", timeTo: "19:45", codeFrom: "SGN", codeTo: "CXR", duration: "1g 05", type: "Trực tiếp", price: 3296000, passengerCount: 75 }
// ];

function FlightListAdmin() {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    airline: "", timeFrom: "", timeTo: "", codeFrom: "", codeTo: "", duration: "", type: "Trực tiếp", price: 0, passengerCount: 0, capacity: 180
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchAirline, setSearchAirline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/flights');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setFlights(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Không thể lấy dữ liệu chuyến bay. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xoá chuyến bay này?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/flights/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        fetchFlights();
      } catch (err) {
        console.error('Error deleting flight:', err);
        alert('Không thể xoá chuyến bay. Vui lòng thử lại sau.');
      }
    }
  };

  const handleEditChange = (id, field, value) => {
    setFlights(flights.map(f =>
      f._id === id ? { ...f, [field]: ['price', 'passengerCount', 'capacity'].includes(field) ? +value : value } : f
    ));
  };

  const paddedID = (id) => {
    return id > 9 ? `${id.padStart(1, '#')}` : `${id.padStart(1, '#0')}`;
  }

  const handleSaveEdit = async () => {
    try {
      const flightToUpdate = flights.find(f => f._id === editingId);
      
      const response = await fetch(`http://localhost:3000/api/flights/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightToUpdate),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      setEditingId(null);

      fetchFlights();
    } catch (err) {
      console.error('Error updating flight:', err);
      alert('Không thể cập nhật chuyến bay. Vui lòng thử lại sau.');
    }
  };

  const handleAddFlight = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlight),
      });

    // Xử lý chi tiết lỗi từ API
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${errorData.message || 'Unknown error'}`;
      } catch (e) {
        // Nếu không thể parse JSON từ lỗi
      }
      throw new Error(errorMessage);
    }

    setNewFlight({
      airline: "", timeFrom: "", timeTo: "", codeFrom: "", codeTo: "", 
      duration: "", type: "Trực tiếp", price: 0, passengerCount: 0, capacity: 180
    });
    setShowForm(false);
    
    fetchFlights();
  } catch (err) {
    console.error('Error adding flight:', err);
    console.log('Request data:', newFlight);
    alert('Không thể thêm chuyến bay. Vui lòng thử lại sau. Lỗi: ' + err.message);
  }
};

// Hàm tính thời gian bay
const calculateDuration = (timeFrom, timeTo) => {
  if (!timeFrom || !timeTo) return "1h 0m";
  
  try {
    const startTime = new Date(timeFrom);
    const endTime = new Date(timeTo);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return "1h 0m";
    }
    
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (e) {
    console.error('Error calculating duration:', e);
    return "1h 0m";
  }
};

  const filteredFlights = flights.filter(
    (f) =>
      ((f.id?.toString() || f._id?.toString() || '').toLowerCase().includes(searchId.toLowerCase())) &&
      (f.airline || '').toLowerCase().includes(searchAirline.toLowerCase())
  );

  // Format flight ID for display
  const formatFlightId = (flight) => {
    if (flight.id) {
      return `#${flight.id}`;
    }
    else if (flight._id && flight._id.length > 5) {
      return `#${flight._id.substring(0, 5)}`;
    }
    // Sửa dòng này - đang truy cập flight.id thay vì flight._id
    return flight._id ? `#${flight._id.substring(0, 5)}` : "#N/A";
  };

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

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchFlights}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-blue-200"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {showForm && (
              <div className="mb-4 bg-gray-100 p-4 rounded animate-fadeIn">
                <h2 className="text-lg font-semibold mb-4">Thêm chuyến bay mới</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Hãng hàng không</label>
                    <input 
                      type="text" 
                      placeholder="VietJet Air, Vietnam Airlines,..." 
                      value={newFlight.airline}
                      onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Sân bay đi (mã)</label>
                    <input 
                      type="text" 
                      placeholder="SGN, HAN, CXR,..." 
                      value={newFlight.codeFrom}
                      onChange={(e) => setNewFlight({ ...newFlight, codeFrom: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Sân bay đến (mã)</label>
                    <input 
                      type="text" 
                      placeholder="SGN, HAN, CXR,..." 
                      value={newFlight.codeTo}
                      onChange={(e) => setNewFlight({ ...newFlight, codeTo: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Thời gian khởi hành</label>
                    <input 
                      type="datetime-local" 
                      value={newFlight.timeFrom}
                      onChange={(e) => setNewFlight({ ...newFlight, timeFrom: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Thời gian đến</label>
                    <input 
                      type="datetime-local" 
                      value={newFlight.timeTo}
                      onChange={(e) => setNewFlight({ ...newFlight, timeTo: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Loại chuyến bay</label>
                    <select
                      value={newFlight.type}
                      onChange={(e) => setNewFlight({ ...newFlight, type: e.target.value })}
                      className="p-2 border rounded"
                    >
                      <option value="Trực tiếp">Trực tiếp</option>
                      <option value="1 chặng dừng">1 chặng dừng</option>
                      <option value="2+ chặng dừng">2+ chặng dừng</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Giá vé (VND)</label>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="VD: 1570780" 
                      value={newFlight.price}
                      onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Số chỗ đã đặt</label>
                    <input 
                      type="number"
                      min="0" 
                      placeholder="VD: 42" 
                      value={newFlight.passengerCount}
                      onChange={(e) => setNewFlight({ ...newFlight, passengerCount: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Sức chứa tối đa</label>
                    <input 
                      type="number"
                      min="1" 
                      placeholder="VD: 180" 
                      value={newFlight.capacity}
                      onChange={(e) => setNewFlight({ ...newFlight, capacity: e.target.value })}
                      className="p-2 border rounded" 
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleAddFlight} 
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  ➕ Xác nhận thêm chuyến bay
                </button>
              </div>
            )}

          <div className="space-y-4">
            {filteredFlights.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Không có dữ liệu chuyến bay nào
              </div>
            ) : (
              filteredFlights.map((f) => (
                <div key={f._id} className="p-4 border rounded shadow-sm animate-slideUp transition-all duration-300">
                  {editingId === f._id ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(f).map(([key, val]) => (
                        key !== '_id' && !['__v', 'createdAt', 'updatedAt'].includes(key) ? (
                          <input
                            key={key}
                            value={val}
                            onChange={(e) => handleEditChange(f._id, key, e.target.value)}
                            className="p-2 border rounded text-sm"
                            placeholder={key}
                          />
                        ) : key === '_id' ? <div key={key} className="text-sm font-bold text-gray-700 col-span-full">Mã chuyến: {formatFlightId(val)}</div> : null
                      ))}
                      <div className="col-span-full flex gap-2 justify-end mt-2">
                        <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <div className="text-sm text-gray-500">Mã chuyến: <span className="text-gray-900 font-medium">{formatFlightId(f)}</span></div>
                        <div className="text-gray-800 font-semibold w-32">{f.airline}</div>
                        <div className="text-sm text-gray-700">{f.codeFrom} → {f.codeTo}</div>
                        <div className="text-sm text-gray-700">{f.timeFrom ? new Date(f.timeFrom).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''} - {f.timeTo ? new Date(f.timeTo).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                        <div className="text-sm text-gray-700">{f.duration} • {f.type}</div>
                        <div className="text-sm text-indigo-600">{f.passengerCount}/{f.capacity} chỗ</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600 font-bold text-lg">{f.price?.toLocaleString()} đ</div>
                        <button onClick={() => setEditingId(f._id)} className="text-blue-500 hover:text-blue-700"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FlightListAdmin;
