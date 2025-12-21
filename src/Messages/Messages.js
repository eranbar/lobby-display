import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";
const Messages = ({refreshTick}) => {
    const [messages, setMessages] = useState([
        "message 1",
        "message 2 ",
        "message 3",
        "message 4",
        "message 5",
        "message 6"]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(MESSAGES_URL);
                setMessages(res.data);
            } catch (err) {
            }
        };

        fetchMessages();
    }, [refreshTick]);

    return (
        <div className="ticker-wrap" aria-hidden="true">
            <div className="ticker-track" style={{ "--ticker-speed": "36s" }}>
                {[...messages, ...messages].map((msg, idx) => (
                    <div key={idx} className="ticker-item">{msg}</div>
                ))}
            </div>
        </div>
    );
}

export default Messages;