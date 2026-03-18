import { useEffect, useState } from "react";
import axios from "axios";
import "./Alerts.css";

const ALERTS_URL = "https://lobby-display-sh6g.onrender.com/api/alerts";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(ALERTS_URL);
        console.log("CLIENT GOT:", res.data);
        setAlerts(res.data);
      } catch (err) {
        console.log("Alert fetch failed");
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (alerts.length === 0) return;

    const timeout = setTimeout(() => {
      setAlerts([]);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [alerts]);

  return (
    <div className={`alerts-panel ${alerts.length ? "open" : ""}`}>

      {/* HEADER */}
      <div className="alerts-header">
        <span className="header-text">התרעות פיקוד העורף</span>
        <img src="/icons/oref-icon.png" className="oref-icon" />
      </div>

      {/* SUB HEADER */}
      {alerts.length > 0 && (
        <div className="alerts-subheader">
          {alerts[0].title}
        </div>
      )}

      {/* LIST */}
      <div className="alerts-list">
        {alerts.flatMap(a =>
          a.areas.map((area, index) => (
            <div key={`${a.time}-${area}-${index}`} className="alert-item">
              {area}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Alerts;