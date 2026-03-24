import { useEffect, useState } from "react";
import { Building2, Settings } from "lucide-react";
import YoutubeManager from "./YoutubeManager/YoutubeManager";
import AdminModal from "./Admin/AdminModal";
import Weather from "./Weather/Weather";
import Messages from "./Messages/Messages";
import News from "./News/News";
import "./News/News.css";
import Alerts from "./Alerts/Alerts";

const App = (props) => {
  const [refreshTick, setRefreshTick] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false); // 👈 popup state

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        const data = await res.json();

        const current = localStorage.getItem("appVersion");

        if (!current) {
          localStorage.setItem("appVersion", data.version);
          return;
        }

        if (current !== data.version) {
          console.log("New version detected, reloading...");
          localStorage.setItem("appVersion", data.version);
          window.location.reload();
        }

        setRefreshTick(t => t + 1);

      } catch (err) {
        console.log("version check failed", err);
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 15000);

    return () => clearInterval(interval);

  }, []);

  // Wake lock for smart TVs
  useEffect(() => {
    const wakeLock = async () => {
      try {
        await navigator.wakeLock.request("screen");
        console.log("Wake lock active");
      } catch (err) {
        console.log("Wake lock failed", err);
      }
    };

    wakeLock();
  }, []);

  // App.js (only the render part shown; keep your existing fetch/useEffect logic)
  return (
    <div className="app-root">
      {/* <Alerts /> */}
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
