import React from "react";
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

const revenueData = [
  { month: "01", revenue: 120_000_000 },
  { month: "02", revenue: 150_000_000 },
  { month: "03", revenue: 210_000_000 },
  { month: "04", revenue: 170_000_000 },
  { month: "05", revenue: 240_000_000 },
  { month: "06", revenue: 310_000_000 },
];

const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
const revenueGrowth = (
  ((revenueData.at(-1).revenue - revenueData.at(-2).revenue) / revenueData.at(-2).revenue) *
  100
).toFixed(2);

const RevenueReport = () => {
  const latestMonth = revenueData.at(-1).month;

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-6 py-10 max-w-6xl mx-auto text-gray-800">
      {/* Tiêu đề trung tâm */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-blue-600">
          <LineChart className="w-8 h-8" />
          BÁO CÁO DOANH THU
        </h1>
        <p className="text-gray-500">
          Tổng kết doanh thu từ tháng 01 đến tháng {latestMonth} năm 2025
        </p>
      </div>

      {/* 3 ô chỉ số */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <Calendar className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Tổng doanh thu 6 tháng</p>
            <p className="text-2xl font-bold text-blue-600">{totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>

        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <TrendingUp className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Tăng trưởng tháng gần nhất</p>
            <p className={`text-2xl font-bold ${revenueGrowth > 0 ? "text-green-600" : "text-red-500"}`}>
              {revenueGrowth}%
            </p>
          </div>
        </div>

        <div className="bg-white border shadow-xl p-6 rounded-xl flex items-center gap-4">
          <span className="text-3xl">📆</span>
          <div>
            <p className="text-sm text-gray-500">Số tháng được thống kê</p>
            <p className="text-2xl font-bold text-indigo-600">{revenueData.length} tháng</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white border p-6 rounded-xl shadow-lg">
        <div className="text-right text-sm text-gray-500 italic mb-2">
          Bảng báo cáo doanh thu tháng {latestMonth}/2025
        </div>

        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-600">
          💰 Biểu đồ Doanh thu theo tháng
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={revenueData} margin={{ top: 30, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" tickFormatter={(v) => (v / 1e6).toFixed(0) + "tr"} />
            <Tooltip
              formatter={(val) => `${val.toLocaleString()} đ`}
              labelFormatter={(label) => `Tháng ${label}`}
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
    </div>
  );
};

export default RevenueReport;
