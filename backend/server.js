import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/Message.js";  // ⚠️ .js extension is required in ESM
import Playlist from "./models/Playlist.js";
import Parser from "rss-parser";
import axios from "axios";

const parser = new Parser();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

let cachedAlerts = [];
let lastAlertId = null;

const fetchAlerts = async () => {
  try {
    const response = await axios.get(
      "https://www.oref.org.il/warningMessages/alert/alerts.json",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Referer": "https://www.oref.org.il/",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
          "Connection": "keep-alive"
        },
        timeout: 5000
      }
    );

    const data = response.data;

    if (data?.data && data.data.length > 0) {
      if (data.id !== lastAlertId) {
        lastAlertId = data.id;

        cachedAlerts = [{
          title: data.title,
          areas: data.data,
          time: new Date()
        }];

        console.log("🚨 New Alert:", cachedAlerts);
      }
    } else {
      // ✅ CLEAR when no alerts
      cachedAlerts = [];
      lastAlertId = null;
    }

  } catch (err) {
    console.log("Polling failed:", err.message);
  }
};

// ✅ ONE interval only
setInterval(fetchAlerts, 2000);

app.get("/api/alerts", (req, res) => {
  res.json(cachedAlerts);
});


let cachedNews = [];
let lastFetch = 0;

app.get("/api/news", async (req, res) => {

  const now = Date.now();

  if (now - lastFetch > 300000) {

    const feed = await parser.parseURL(
      "https://www.ynet.co.il/Integration/StoryRss2.xml"
    );

    cachedNews = feed.items.slice().map(item => ({
      title: item.title,
      link: item.link,
      date: new Date(item.pubDate)?.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }));

    lastFetch = now;

  }

  res.json(cachedNews);

});

// GET all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// GET all messages
app.get("/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// SAVE messages (overwrite)

app.post("/api/messages", async (req, res) => {

  try {

    const messages = req.body;

    // remove existing messages
    await Message.deleteMany({});

    // insert new messages
    if (messages.length > 0) {
      await Message.insertMany(messages);
    }

    res.json({ success: true });

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: "Failed to save messages" });

  }

});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
