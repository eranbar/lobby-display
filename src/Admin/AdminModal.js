import React, { useState } from "react";
import "./AdminModal.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const AdminModal = ({ messages, setMessages, onClose }) => {

    const [newMessageText, setNewMessageText] = useState("");
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const MESSAGES_URL = "https://lobby-display-sh6g.onrender.com/api/messages";

    const saveMessage = () => {
        if (!newMessageText.trim()) return;

        const newMsg = {
            //_id: uuidv4(),
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

    const editMessage = (msg) => {

        setEditingMessageId(msg._id);
        setEditedText(msg.text);

    };

    const saveEdit = () => {

        if (!editedText.trim()) return;

        setMessages(prev =>
            prev.map(m =>
                m._id === editingMessageId
                    ? { ...m, text: editedText }
                    : m
            )
        );

        setEditingMessageId(null);
        setEditedText("");

    };

    const discardEdit = () => {

        setEditingMessageId(null);
        setEditedText("");

    };

    const HandleCloseModal = async () => {

        try {
            await axios.post(MESSAGES_URL, messages);
            console.log("Messages saved");

        } catch (err) {
            console.error("Failed to save messages", err);
        }
        onClose();
    }

    return (
        <div className="admin-modal">

            <div className="admin-modal-content">

                {/* HEADER */}
                <div className="admin-modal-header">
                    <h2 style={{ alignItems: "center" }}>ניהול הודעות לדיירים</h2>

                    <button
                        className="admin-close"
                        onClick={HandleCloseModal}
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="admin-modal-body">

                    <div className="admin-input-row">

                        <input
                            type="text"
                            placeholder="הכנס הודעה חדשה.."
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
                                className={`message-item ${editingMessageId === msg._id ? "editing" : ""
                                    }`}
                            >

                                {editingMessageId === msg._id ? (

                                    <>
                                        <input
                                            className="edit-input"
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                        />

                                        <div className="message-actions">

                                            <button
                                                className="icon-btn"
                                                onClick={saveEdit}
                                            >
                                                <img src="/icons/save.jpeg" alt="save" />
                                            </button>

                                            <button
                                                className="icon-btn"
                                                onClick={discardEdit}
                                            >
                                                <img src="/icons/trash.png" alt="discard" />
                                            </button>

                                        </div>
                                    </>

                                ) : (

                                    <>
                                        <span className="message-text">
                                            {msg.text}
                                        </span>

                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>

                                        <div className="message-actions">

                                            <button
                                                className="icon-btn"
                                                onClick={() => editMessage(msg)}
                                            >
                                                <img src="/icons/edit.jpeg" alt="edit" />
                                            </button>

                                            <button
                                                className="icon-btn"
                                                onClick={() => deleteMessage(msg._id)}
                                            >
                                                <img src="/icons/trash.png" alt="delete" />
                                            </button>

                                        </div>
                                    </>

                                )}

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminModal;