import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeVideoIds: { type: [String], default: [] }, // array of YouTube video IDs
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Playlist", playlistSchema);