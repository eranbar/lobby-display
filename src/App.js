import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import YoutubeManager from "./YoutubeManager/YoutubeManager";
import SignInButton from "./SignInButton";  // adjust path accordingly
import Weather from "./Weather/Weather";
import Messages from "./Messages/Messages";

const App = (props) => {
  const [refreshTick, setRefreshTick] = useState(0);

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
        <div style={{ "align-items": "left" }}>
          <SignInButton refreshTick={refreshTick} />
        </div>
        <h1 className="title">
          <Building2 className="icon" /> יחידה 101 בניין 12
        </h1>
        <Weather refreshTick={refreshTick} />
      </header>
      <div className="video-container">
        <YoutubeManager refreshTick={refreshTick} />
        <div className="messages-overlay">
          <Messages refreshTick={refreshTick} />
        </div>
      </div>
    </div >
  );


}

export default App;
