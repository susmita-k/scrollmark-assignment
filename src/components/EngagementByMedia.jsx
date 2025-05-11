import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementByMediaId = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Replace fetch URL with your actual data if needed
    fetch('/treehut_data.json')
      .then(res => res.json())
      .then(json => {
        const mediaCounts = {};
        json.forEach(({ media_id }) => {
          if (media_id) {
            mediaCounts[media_id] = (mediaCounts[media_id] || 0) + 1;
          }
        });
        const chartData = Object.entries(mediaCounts).map(([mid, count]) => ({
          name: mid,
          value: count,
        }));
        setData(chartData);
      })
      .catch(console.error);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#40E0D0', '#FF6347'];

  if (data.length === 0)
    return <p style={{ padding: 20 }}>Loading data...</p>;

  return (
    <div style={{ width: '100%', height: 500, padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Comments Count by Media ID</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            innerRadius={80}
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val} comments`} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '14px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementByMediaId;
