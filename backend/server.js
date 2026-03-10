import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/Message.js";  // ⚠️ .js extension is required in ESM
import Playlist from "./models/Playlist.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

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