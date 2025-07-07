import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle, Check, X, FileSpreadsheet } from "lucide-react";
import "tailwindcss/tailwind.css";
import * as XLSX from "xlsx";
const API_Url = import.meta.env.VITE_CLIENT_URL;

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
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);
  const [stopovers, setStopovers] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_Url}/api/flights`);
      
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
        const response = await fetch(`${API_Url}/api/flights/${id}`, {
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
      
      const response = await fetch(`${API_Url}/api/flights/${editingId}`, {
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

  // Reset stopovers when showForm toggled off
  useEffect(() => {
    if (!showForm) setStopovers([]);
  }, [showForm]);

  // Thêm chặng dừng mới
  const handleAddStopover = () => {
    setStopovers([...stopovers, { airport: "", stopTime: "" }]);
  };

  // Xoá chặng dừng
  const handleRemoveStopover = (idx) => {
    setStopovers(stopovers.filter((_, i) => i !== idx));
  };

  // Sửa thông tin chặng dừng
  const handleStopoverChange = (idx, field, value) => {
    setStopovers(stopovers.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  // Helper để tạo id tự tăng đơn giản phía client (nên dùng phía server thực tế)
  const getNextFlightId = () => {
    if (!flights || flights.length === 0) return 1;
    const maxId = Math.max(...flights.map(f => Number(f.id) || 0));
    return maxId + 1;
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

  const handleAddFlight = async () => {
    try {
      // Map stopovers sang intermediateStops đúng format backend
      
      const intermediateStops = stopovers
        .filter(s => s.airport && s.stopTime)
        .map(s => ({
          airport: s.airport,
          stopDuration: Number(s.stopTime)
        }));

      const flightData = {
        id: getNextFlightId(),
        airline: newFlight.airline,
        flightNumber: "", // hoặc sinh tự động nếu muốn
        timeFrom: newFlight.timeFrom,
        timeTo: newFlight.timeTo,
        codeFrom: newFlight.codeFrom,
        codeTo: newFlight.codeTo,
        duration: calculateDuration(newFlight.timeFrom, newFlight.timeTo),
        capacity: Number(newFlight.capacity) || 180,
        passengerCount: Number(newFlight.passengerCount) || 0,
        price: Number(newFlight.price) || 0,
        intermediateStops, // đúng tên field backend
      };
      
      const response = await fetch(`${API_Url}/api/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });

      // Xử lý chi tiết lỗi từ API
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || 'Unknown error'}`;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      setNewFlight({
        airline: "", timeFrom: "", timeTo: "", codeFrom: "", codeTo: "",
        duration: "", type: "Trực tiếp", price: 0, passengerCount: 0, capacity: 180
      });
      setShowForm(false);
      setStopovers([]);
      fetchFlights();
    } catch (err) {
      console.error('Error adding flight:', err);
      alert('Không thể thêm chuyến bay. Vui lòng thử lại sau. Lỗi: ' + err.message);
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

  // Excel template download
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        airline: "VietJet Air",
        timeFrom: "2025-07-01T08:00",
        timeTo: "2025-07-01T09:30",
        codeFrom: "SGN",
        codeTo: "HAN",
        duration: "1h30m",
        capacity: 180,
        passengerCount: 10,
        price: 1500000,
        // intermediateStops: '[{"airport":"DAD","stopDuration":30}]'
        intermediateStops: '[{"airport":"DAD","stopDuration":30},{"airport":"HUI","stopDuration":25}]'
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Flights");
    XLSX.writeFile(wb, "flights_template.xlsx");
  };

  // Excel import: map đúng format backend
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      let nextId = getNextFlightId();

      for (const row of rows) {
        let intermediateStops = [];
        if (row.intermediateStops) {
          try {
            intermediateStops = JSON.parse(row.intermediateStops);
          } catch {}
        }
        const flight = {
          id: nextId++,
          airline: row.airline || "",
          flightNumber: row.flightNumber || "",
          timeFrom: row.timeFrom || "",
          timeTo: row.timeTo || "",
          codeFrom: row.codeFrom || "",
          codeTo: row.codeTo || "",
          duration: row.duration || "",
          capacity: Number(row.capacity) || 180,
          passengerCount: Number(row.passengerCount) || 0,
          price: Number(row.price) || 0,
          intermediateStops,
        };

        await fetch(`${API_Url}/api/flights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flight),
        });
      }
      alert("Đã thêm các chuyến bay từ file Excel!");
      fetchFlights();
    } catch (err) {
      alert("Lỗi khi đọc file hoặc thêm chuyến bay: " + err.message);
    } finally {
      setExcelLoading(false);
      e.target.value = "";
      setExcelDialogOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 animate-slideUp">✈️ Danh sách chuyến bay</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
            <PlusCircle className="w-5 h-5" /> Thêm chuyến bay
          </button>
          <button
            onClick={() => setExcelDialogOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            <FileSpreadsheet className="w-5 h-5" /> Thêm bằng file Excel
          </button>
        </div>
      </div>
      {/* Excel Dialog */}
      {excelDialogOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setExcelDialogOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" /> Thêm chuyến bay bằng Excel
            </h2>
            <p className="mb-2 text-gray-700 text-sm">
              Tải file mẫu, điền thông tin chuyến bay (bao gồm danh sách chặng dừng nếu có), sau đó chọn file để nhập.
            </p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleDownloadTemplate}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Tải file mẫu
              </button>
              <label className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm cursor-pointer">
                Chọn file Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                  disabled={excelLoading}
                />
              </label>
            </div>
            {excelLoading && <div className="text-blue-600 font-semibold">Đang xử lý file Excel...</div>}
            <div className="text-xs text-gray-500 mt-2">
              <b>Lưu ý:</b> Cột <code>intermediateStops</code> là chuỗi JSON, ví dụ:<br />
              <code>[&#123;"airport":"DAD","stopDuration":30&#125;,&#123;"airport":"HUI","stopDuration":25&#125;]</code>
            </div>
          </div>
        </div>
      )}
      {excelLoading && (
        <div className="mb-4 text-blue-600 font-semibold">Đang xử lý file Excel...</div>
      )}
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
                </div>
                {/* Chặng dừng */}
                <div className="mt-4 bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">Chặng dừng (nếu có)</span>
                    <button
                      type="button"
                      onClick={handleAddStopover}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      + Thêm chặng dừng
                    </button>
                  </div>
                  {stopovers.length === 0 && (
                    <div className="text-gray-400 text-sm">Không có chặng dừng nào.</div>
                  )}
                  {stopovers.map((stop, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        placeholder="Mã sân bay (VD: DAD)"
                        value={stop.airport}
                        onChange={e => handleStopoverChange(idx, "airport", e.target.value)}
                        className="p-2 border rounded w-40"
                      />
                      <input
                        type="number"
                        min="10"
                        placeholder="Thời gian dừng (phút)"
                        value={stop.stopTime}
                        onChange={e => handleStopoverChange(idx, "stopTime", e.target.value)}
                        className="p-2 border rounded w-40"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStopover(idx)}
                        className="text-red-500 hover:text-red-700 px-2"
                        title="Xoá chặng dừng"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
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
                        <div className="text-sm text-gray-700">{f.duration}</div>
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
