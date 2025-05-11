import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const TopMediaTypesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/treehut_data.json')
      .then(res => res.json())
      .then(json => {
        // Group comments by media_type
        const mediaTypeCounts = {};
        json.forEach(({ media_type }) => {
          if (media_type !== undefined && media_type !== null) {
            mediaTypeCounts[media_type] = (mediaTypeCounts[media_type] || 0) + 1;
          }
        });

        // Convert to array, sort, take top 10
        const top10 = Object.entries(mediaTypeCounts)
          .map(([type, count]) => ({ name: type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setData(top10);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setData([]);  // fallback to empty
      });
  }, []);

  // Colors for slices
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#fa8072', '#20b2aa', '#6495ed'];

  // Show loading if no data yet
  if (data.length === 0) {
    return <p style={{ padding: 20 }}>Loading top media types...</p>;
  }

  return (
    <div style={{ width: '100%', height: 500, padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Top 10 Media Types by Comments</h3>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(val) => `${val} comments`} />
          <Legend />
          <Bar dataKey="count" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopMediaTypesChart;
