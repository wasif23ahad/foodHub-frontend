"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#DC2626", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

interface ChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  height?: number;
}

export function CustomLineChart({ data, xKey, yKey, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
          dataKey={xKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748B", fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748B", fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: "12px", 
            border: "none", 
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
          }} 
        />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke="#DC2626" 
          strokeWidth={3} 
          dot={{ r: 4, fill: "#DC2626", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CustomBarChart({ data, xKey, yKey, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
          dataKey={xKey} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748B", fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#64748B", fontSize: 12 }}
        />
        <Tooltip 
          cursor={{ fill: "rgba(220, 38, 38, 0.05)" }}
          contentStyle={{ 
            borderRadius: "12px", 
            border: "none", 
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
          }} 
        />
        <Bar dataKey={yKey} fill="#DC2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CustomPieChart({ data, xKey, yKey, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey={yKey}
          nameKey={xKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: "12px", 
            border: "none", 
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" 
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
