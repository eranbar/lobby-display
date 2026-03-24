import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// index.js (TOP of file, before ReactDOM.render)

const logToServer = (payload) => {
  fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => { });
}

window.addEventListener("error", (e) => {
  logToServer({
    type: "error",
    message: e.message,
    stack: e.error?.stack,
    time: new Date().toISOString()
  });
});

window.addEventListener("unhandledrejection", (e) => {
  logToServer({
    type: "promise_rejection",
    message: e.reason?.message,
    stack: e.reason?.stack,
    time: new Date().toISOString()
  });
});

// sample memory usage to prevent crushes and memory leak
setInterval(() => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1024 / 1024;
    const total = performance.memory.totalJSHeapSize / 1024 / 1024;

    console.log(`Memory: ${used.toFixed(2)} MB / ${total.toFixed(2)} MB`);

    fetch("/api/memory-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usedMB: used,
        totalMB: total,
        time: new Date().toISOString()
      })
    }).catch(() => { });
  }
}, 30000);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
