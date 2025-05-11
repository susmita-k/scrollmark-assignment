import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopMediaIdsPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/treehut_data.json')
      .then(res => res.json())
      .then(json => {
        const mediaCounts = {};
        json.forEach(({ media_id }) => {
          if (media_id) {
            mediaCounts[media_id] = (mediaCounts[media_id] || 0) + 1;
          }
        });
        const top10 = Object.entries(mediaCounts)
          .map(([mid, count]) => ({ name: mid, value: count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        setData(top10);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setData([]); // fallback
      });
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#40E0D0', '#FF6347', '#4682B4', '#DA70D6', '#FFD700'];

  if (data.length === 0) return <p style={{ padding: 20 }}>Loading top media IDs...</p>;

  return (
    <div style={{ width: '100%', height: 500, padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Top 10 Media IDs by Comments (Pie Chart)</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val} comments`} />
          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '14px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopMediaIdsPieChart;
