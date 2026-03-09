import React, { useState } from "react";
import "./AdminModal.css";

const AdminModal = ({ messages, setMessages, onClose }) => {

    const [newMessageText, setNewMessageText] = useState("");

    const saveMessage = () => {
        if (!newMessageText.trim()) return;

        const newMsg = {
            _id: Date.now(),
            text: newMessageText,
            timestamp: Date.now()
        };

        // Create a brand new array
        setMessages(prevMessages => [...prevMessages, newMsg]);
        setNewMessageText("");

    };

    const deleteMessage = (id) => {
        // Filter creates a new array in memory
        setMessages(prevMessages => {
            const updated = prevMessages.filter(m => m._id !== id);
            return [...updated]; // force new array reference
        });
    };

    return (
        <div className="admin-modal">

            <div className="admin-modal-content">

                {/* HEADER */}
                <div className="admin-modal-header">
                    <h2>Admin Panel</h2>

                    <button
                        className="admin-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="admin-modal-body">

                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

                        <input
                            type="text"
                            placeholder="Message text"
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            style={{ flex: 1 }}
                        />

                        <button onClick={saveMessage}>
                            Add
                        </button>

                    </div>

                    <div className="messages-list">

                        {messages.map(msg => (
                            <div
                                key={msg._id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                                }}
                            >

                                <span>{msg.text}</span>

                                <span>{msg.timestamp}</span>

                                <button onClick={() => deleteMessage(msg._id)}>
                                    Delete
                                </button>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminModal;