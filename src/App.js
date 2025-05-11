import logo from './logo.svg';
import './App.css';

import TreehutDashboard from './components/TreehutDashboard';
import MediaSentimentSankey from './components/MediaSentimentSankey';
//import EngagementByMediaType from './components/EngagementByMedia';
//import TopMediaTypesChart from './components/TopMediaTypesChart';
import TopMediaIdsPieChart from './components/TopMediaIdsPieChart';
import TopMediaCaptionPieChart from './components/TopMediaCaptionPieChart';


function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Scrollmark Trend Analysis Assignment</h1>
      <TreehutDashboard />
      <hr />
      <h2>Engagement By Media ID</h2> 
      {/*<EngagementByMediaType /> */}
      <h2>Top 10 Media Types</h2>
      <TopMediaIdsPieChart />
      <hr />
      <h2>Engagement By Media Captions</h2> 
      <h2>Top 10 Captions</h2>
      <TopMediaCaptionPieChart />
     {/*<MediaSentimentSankey /> */}
    </div>
  );
}

export default App;