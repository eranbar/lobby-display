import { useEffect, useState } from "react";
import { Building2, Settings } from "lucide-react";
import YoutubeManager from "./YoutubeManager/YoutubeManager";
import AdminModal from "./Admin/AdminModal";
import Weather from "./Weather/Weather";
import Messages from "./Messages/Messages";
import News from "./News/News";
import "./News/News.css";

const App = (props) => {
  const [refreshTick, setRefreshTick] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false); // 👈 popup state

  useEffect(() => {
    // Auto-refresh every 30 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/version.json", { cache: "no-store" });
        const data = await response.json();
        console.log("ENV:", process.env);
        console.log("VERSION:", process.env.REACT_APP_VERSION);
        if (data.version !== process.env.REACT_APP_VERSION) {
          window.location.reload(true);
        }
        // 🔥 trigger re-render
        setRefreshTick(tick => tick + 1);

      } catch (err) {
        console.log("version check failed", err);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // App.js (only the render part shown; keep your existing fetch/useEffect logic)
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-left">
          <Weather refreshTick={refreshTick} />
        </div>
        <div className="topbar-center">
          <h1 className="title">
            <Building2 className="icon" /> יחידה 101 בניין 12
          </h1>
        </div>
        <div className="topbar-right">
          <button
            className="admin-button"
            onClick={() => setShowAdmin(true)}
          >
            <Settings size={18} />
            Admin
          </button>
        </div>
      </header>
      <div className="video-container">
        <YoutubeManager refreshTick={refreshTick} />
        <div className="messages-overlay">
          <Messages messages={messages} setMessages={setMessages} showAdmin={showAdmin} />
        </div>
      </div>
      <div className="news-bar">
        <News />
      </div>
      {showAdmin && (
        <AdminModal
          messages={messages}
          setMessages={setMessages}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div >
  );


}

export default App;
