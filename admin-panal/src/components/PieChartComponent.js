import React from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { convertDataChart } from '../utils/chart';

const PieChartComponent = (props) => {
  const data = convertDataChart(props.data, "paymentMethod");// sort trong mang data, voi dieu kien

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend // hien thi mau và nhan o ben phai bieu do
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          formatter={(value, entry) => `${entry.value} (${(entry.payload.percent * 100).toFixed(0)}%)`} // hien thi them %
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent
