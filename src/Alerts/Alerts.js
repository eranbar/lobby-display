import { useEffect, useState } from "react";
import axios from "axios";

const ALERTS_URL = "https://lobby-display-sh6g.onrender.com/api/alerts";

const Alerts = () => {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    const fetchAlerts = async () => {

      try {

        const res = await axios.get(ALERTS_URL);

        setAlerts(res.data);

      } catch (err) {

        console.log("Alert fetch failed");

      }

    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000); // every 5 sec

    return () => clearInterval(interval);

  }, []);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-overlay">
      {alerts.map((alert, i) => (
        <div key={i} className="alert-box">
          🚨 {alert.title} – {alert.areas.join(", ")}
        </div>
      ))}
    </div>
  );
};

export default Alerts;
