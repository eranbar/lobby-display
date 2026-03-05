import { useEffect, useState } from "react";
import axios from "axios";
//const MESSAGES_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/lobby-messages/main/messages.json";
const MESSAGES_URL = "https://lobby-display-sh6g.onrender.com:4000/messages";
const Messages = ({refreshTick}) => {
/*     const [messages, setMessages] = useState([
        "message 1",
        "message 2 ",
        "message 3",
        "message 4",
        "message 5",
        "message 6"]); */

    const [messages, setMessages] = useState([]);

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
                    <div key={idx} className="ticker-item">{msg?.text}</div>
                ))}
            </div>
        </div>
    );
}

export default Messages;