import React, { useEffect, useState } from "react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const RegulationPage = ({ showChangePolicy_ }) => {
  const [regulations, setRegulations] = useState(null);
  const [editRegulations, setEditRegulations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fields = [
    { label: "Số lượng sân bay", key: "soLuongSanBay" },
    { label: "Thời gian bay tối thiểu (phút)", key: "thoiGianBayToiThieu" },
    { label: "Số sân bay trung gian tối đa", key: "soSanBayTrungGianToiDa" },
    { label: "Thời gian dừng tối thiểu (phút)", key: "thoiGianDungToiThieu" },
    { label: "Thời gian dừng tối đa (phút)", key: "thoiGianDungToiDa" },
    { label: "Thời gian đặt vé chậm nhất (giờ)", key: "thoiGianDatVeChamNhat" },
    { label: "Thời gian huỷ vé (giờ)", key: "thoiGianHuyVe" },
  ];

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const res = await fetch(`${API_Url}/api/regulations`);
        const data = await res.json();
        setRegulations(data);
        setEditRegulations(data);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegulations();
  }, [showChangePolicy_]);

  const handleChange = (field, value) => {
    setEditRegulations((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = Object.fromEntries(
        fields.map(({ key }) => [key, editRegulations[key]])
      );

      const res = await fetch(`${API_Url}/api/regulations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setRegulations(result.regulations);
        setEditRegulations(result.regulations);
        setEditMode(false);
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      alert("Lỗi khi kết nối tới server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">⏳ Đang tải quy định...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded text-black">
      <h1 className="text-2xl font-bold mb-4">📋 Quy định hệ thống</h1>

      {fields.map(({ label, key }) => (
        <div key={key} className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">{label}</label>
          {editMode ? (
            <input
              type="number"
              value={editRegulations?.[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <div className="px-3 py-2 border rounded bg-gray-50">
              {regulations?.[key]}
            </div>
          )}
        </div>
      ))}

      {!editMode ? (
        <button
          onClick={() => setEditMode(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ✏️ Thay đổi quy định
        </button>
      ) : (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Đang lưu..." : "✔ OK"}
          </button>
          <button
            onClick={() => {
              setEditRegulations(regulations);
              setEditMode(false);
            }}
            disabled={saving}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ❌ Huỷ
          </button>
        </div>
      )}
    </div>
  );
};

export default RegulationPage;
