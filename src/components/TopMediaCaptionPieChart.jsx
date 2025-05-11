import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopMediaCaptionPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/treehut_data.json')
      .then(res => res.json())
      .then(json => {
        const captionCounts = {};
        json.forEach(({ media_caption }) => {
          if (media_caption) {
            captionCounts[media_caption] = (captionCounts[media_caption] || 0) + 1;
          }
        });
        const top10 = Object.entries(captionCounts)
          .map(([caption, count]) => ({ name: caption, value: count }))
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

  if (data.length === 0) return <p style={{ padding: 20 }}>Loading top media captions...</p>;

  return (
    <div style={{ width: '100%', height: 500, padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Top 10 Media Captions (by Comment Count)</h3>
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
          {/* Legend with label truncation to 20 chars + ellipses */}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '14px', marginTop: 20 }}
            formatter={(label) => label.length > 50 ? label.slice(0, 47) + '...' : label}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopMediaCaptionPieChart;
