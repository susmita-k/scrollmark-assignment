import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const TreehutDashboard = () => {
  const [dailyData, setData] = useState([]);

  useEffect(() => {
    fetch("/treehut_data.json")
      .then((res) => res.json())
      .then((json) => {
        const grouped = {};
        json.forEach(({ timestamp, comment_text }) => {
          // Analyze sentiment for each comment_text
          const result = sentiment.analyze(comment_text);
          const sentiment_polarity = result.score; // score can be negative, positive, or zero
          
          const date = new Date(timestamp).toISOString().split("T")[0];
          if (!grouped[date]) grouped[date] = { date, sentimentSum: 0, count: 0 };
          
          grouped[date].sentimentSum += sentiment_polarity;
          grouped[date].count += 1;
        });

        const formatted = Object.values(grouped).map((item) => ({
          date: item.date,
          comment_count: item.count,
          avg_sentiment: item.count > 0 ? parseFloat((item.sentimentSum / item.count).toFixed(3)) : 0,
        }));

        setData(formatted);
      });
  }, []);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      {/* Description */}
      <h3>Here’s an initial trend analysis for @treehut on Instagram:</h3>
      <ul>
        <li><strong>Comment Volume</strong> (sky blue): Shows how active users were on each day.</li>
        <li><strong>Average Sentiment</strong> (orange): Ranges from -2 (negative) to 2 (positive), based on the emotional tone of comments. 0 is neutral.</li>
      </ul>

      {/* Chart with Comment Volume and Avg Sentiment */}
      <h4>Comment Volume & Average Sentiment Over Time</h4>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" />
          {/* Left Y-Axis for comment count */}
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Comments', angle: -90, position: 'insideLeft' }} />
          {/* Right Y-Axis for sentiment (-1 to 1) */}
          <YAxis yAxisId="right" orientation="right" stroke="#ff7300" domain={[-1, 1]} tickFormatter={(v) => v.toFixed(2)} label={{ value: 'Sentiment', angle: 90, position: 'insideRight' }} />

          <Tooltip labelFormatter={(label) => label} />
          <Legend />

          <Bar yAxisId="left" dataKey="comment_count" fill="skyblue" name="Comment Volume" />
          <Line yAxisId="right" type="monotone" dataKey="avg_sentiment" stroke="orange" strokeWidth={2} name="Avg Sentiment" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TreehutDashboard;
