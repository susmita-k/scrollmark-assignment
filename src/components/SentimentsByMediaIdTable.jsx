import React, { useState, useEffect } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const SentimentsByMediaIdTable = () => {
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    fetch("/treehut_data.json")
      .then((res) => res.json())
      .then((json) => {
        // Group comments by media_id
        const mediaMap = {};

        json.forEach(({ media_id, comment_text }) => {
          // Analyze sentiment for each comment
          const result = sentiment.analyze(comment_text);
          const sentiment_score = result.score; // positive or negative

          if (!mediaMap[media_id]) {
            mediaMap[media_id] = {
              media_id,
              sentimentSum: 0,
              count: 0
            };
          }
          mediaMap[media_id].sentimentSum += sentiment_score;
          mediaMap[media_id].count += 1;
        });

        // Convert to array and calculate average sentiment
        const mediaArray = Object.values(mediaMap).map(({ media_id, sentimentSum, count }) => ({
          media_id,
          average_sentiment: count > 0 ? parseFloat((sentimentSum / count).toFixed(3)) : 0,
          comment_count: count,
        }));

        setGroupedData(mediaArray);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Comments Grouped by Media ID</h3>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Media ID</th>
            <th>Comment Count</th>
            <th>Average Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((item) => (
            <tr key={item.media_id}>
              <td>{item.media_id}</td>
              <td>{item.comment_count}</td>
              <td>{item.average_sentiment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SentimentsByMediaIdTable;
