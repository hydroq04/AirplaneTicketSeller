import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Calendar, LineChart } from "lucide-react";
const API_Url = import.meta.env.VITE_CLIENT_URL;

const RevenueReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy danh sách năm hợp lý (giả sử 2023-2026)
  const yearOptions = [];
  for (let y = 2023; y <= now.getFullYear() + 2; ++y) yearOptions.push(y);

  useEffect(() => {
    setLoading(true);
    setReport(null);
    setError("");
    fetch(`${API_Url}/api/reports/monthly?month=${month}&year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi server hoặc không có dữ liệu");
        return res.json();
      })
      .then((data) => {
        setReport(data);
        setError("");
      })
      .catch((err) => setError("Không thể tải dữ liệu báo cáo: " + err.message))
      .finally(() => setLoading(false));
  }, [month, year]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-blue-600">
        Đang tải báo cáo doanh thu...
      </div>
    );
  }
  // Hiển thị phần chọn tháng/năm kể cả khi không có dữ liệu
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] px-6 py-10 max-w-6xl mx-auto text-gray-800 flex flex-col items-center justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="font-semibold text-gray-700">Tháng:</label>
            <select
              id="month"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="year" className="font-semibold text-gray-700">Năm:</label>
            <select
              id="year"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-xl text-red-600">
          {error}
        </div>
      </div>
    );
  }
  if (!report || !Array.isArray(report.flights) || report.flights.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] px-6 py-10 max-w-6xl mx-auto text-gray-800 flex flex-col items-center justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="font-semibold text-gray-700">Tháng:</label>
            <select
              id="month"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="year" className="font-semibold text-gray-700">Năm:</label>
            <select
              id="year"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
          Không có báo cáo vào tháng này
        </div>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = report.flights.map(f => ({
    name: f.airline + " " + f.route,
    revenue: f.revenue,
    ticketCount: f.ticketCount,
  }));

  // Tính tăng trưởng so với tháng trước (giả sử có thể lấy được)
  // Ở đây chỉ hiển thị 0% vì không có dữ liệu tháng trước
  const revenueGrowth = "0.00";

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-6 py-10 max-w-6xl mx-auto text-gray-800">
      {/* Chọn tháng/năm */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="month" className="font-semibold text-gray-700">Tháng:</label>
          <select
            id="month"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="year" className="font-semibold text-gray-700">Năm:</label>
          <select
            id="year"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tiêu đề trung tâm */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-blue-600">
          <LineChart className="w-8 h-8" />
          BÁO CÁO DOANH THU
        </h1>
        <p className="text-gray-500">
          Tổng kết doanh thu tháng {report.month.toString().padStart(2, "0")}/{report.year}
        </p>
      </div>

      {/* 3 ô chỉ số */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <Calendar className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Tổng doanh thu tháng</p>
            <p className="text-2xl font-bold text-blue-600">{report.totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>

        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Tăng trưởng tháng này</p>
            <p className={`text-2xl font-bold text-green-600`}>
              {revenueGrowth}%
            </p>
          </div>
        </div>

        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <span className="text-3xl">📆</span>
          <div>
            <p className="text-sm text-gray-500">Số chuyến bay thống kê</p>
            <p className="text-2xl font-bold text-indigo-600">{report.flights.length} chuyến</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white border p-6 rounded-xl shadow-lg mb-8">
        <div className="text-right text-sm text-gray-500 italic mb-2">
          Báo cáo doanh thu tháng {report.month.toString().padStart(2, "0")}/{report.year}
        </div>

        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-600">
          💰 Biểu đồ Doanh thu theo chuyến bay
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 30, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="#888" tickFormatter={(v) => (v / 1e6).toFixed(0) + "tr"} />
            <Tooltip
              formatter={(val) => `${val.toLocaleString()} đ`}
              labelFormatter={(label) => label}
              contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #ddd" }}
              itemStyle={{ color: "#333" }}
            />
            <Legend wrapperStyle={{ color: "#555" }} />
            <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu (VNĐ)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-right text-xs italic text-gray-500 mt-4">
          Cập nhật lúc: {new Date().toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Bảng chi tiết chuyến bay */}
      <div className="bg-white border p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-blue-700">Chi tiết doanh thu các chuyến bay</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Hãng</th>
                <th className="px-4 py-2">Hành trình</th>
                <th className="px-4 py-2">Ngày khởi hành</th>
                <th className="px-4 py-2">Số vé</th>
                <th className="px-4 py-2">Doanh thu</th>
                <th className="px-4 py-2">% tổng</th>
              </tr>
            </thead>
            <tbody>
              {report.flights.map((f, idx) => (
                <tr key={f.flightId} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{f.airline}</td>
                  <td className="px-4 py-2">{f.route}</td>
                  <td className="px-4 py-2">{new Date(f.departureDate).toLocaleString("vi-VN")}</td>
                  <td className="px-4 py-2 text-center">{f.ticketCount}</td>
                  <td className="px-4 py-2 text-blue-700 font-semibold">{f.revenue.toLocaleString()} đ</td>
                  <td className="px-4 py-2 text-center">{f.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
