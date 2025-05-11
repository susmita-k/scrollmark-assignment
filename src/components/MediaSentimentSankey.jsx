import React, { useEffect, useState } from 'react';
import { Sankey } from 'recharts';
import { sankey } from 'd3-sankey';

const categories = [
  { name: 'Negative' },
  { name: 'Neutral' },
  { name: 'Positive' }
];

const categorizeSentiment = (score) => {
  if (score < -0.1) return 'Negative';
  if (score > -0.1 && score < 0.1) return 'Neutral';
  if (score >= 0.1) return 'Positive';
  return 'Neutral';
};

const MediaSentimentSankeyComponent = () => {
  const [processedData, setProcessedData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch('/treehut_data.json')
      .then(res => res.json())
      .then(json => {
        const sentiment = new (require('sentiment'))();

        const flowCounts = {}; // { media_id: {Negative: 0, Neutral: 0, Positive: 0} }

        json.forEach(({ media_id, comment_text }) => {
          const result = sentiment.analyze(comment_text);
          const category = categorizeSentiment(result.score);
          if (!flowCounts[media_id]) {
            flowCounts[media_id] = { Negative: 0, Neutral: 0, Positive: 0 };
          }
          flowCounts[media_id][category]++;
        });

        // Create nodes array
        const nodes = [];
        const nodeMap = {};
        let index = 0;
        Object.keys(flowCounts).forEach(mid => {
          nodes.push({ name: mid });
          nodeMap[mid] = index++;
        });
        categories.forEach(c => {
          nodes.push({ name: c.name });
          nodeMap[c.name] = index++;
        });

        // Create links array
        const links = [];
        Object.entries(flowCounts).forEach(([mid, counts]) => {
          categories.forEach(c => {
            const val = counts[c.name] || 0;
            if (val > 0) {
              links.push({ source: mid, target: c.name, value: val });
            }
          });
        });

        // Run d3-sankey layout algorithm
        const graph = { nodes: nodes.map(d => ({ ...d })), links: [...links] };
        const sankeyLayout = sankey()
          .nodeWidth(20)
          .nodePadding(20)
          .size([800, 600]); // Width and height

        sankeyLayout(graph);

        // graph.nodes now contain x0, x1, y0, y1 (positions)
        setProcessedData({ nodes: graph.nodes, links: graph.links });
        setTimeout(() => setIsReady(true), 50); // small delay to ensure layout
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }, []);

  return (
    <div style={{ width: '100%', height: 700, padding: '20px' }}>
      <h3>Flows from Media IDs to Sentiment Categories</h3>
      {isReady && processedData ? (
        <Sankey
          width={800}
          height={600}
          data={processedData}
          nodePadding={20}
          nodeWidth={20}
        />
      ) : (
        <p>Loading graph...</p>
      )}
    </div>
  );
};

export default MediaSentimentSankeyComponent;
