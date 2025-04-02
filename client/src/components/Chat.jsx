import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io("https://eventique-backend-api.onrender.com", { 
    withCredentials: true 
 });// Ensure single socket connection

const Chat = ({ userEmail, userName, organizerEmail, organizerName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userEmail || !organizerEmail) {
            console.error("Chat cannot be initialized, missing emails.");
            return;
        }

        // Join the chat room for both user and organizer
        socket.emit('join', userEmail);
        socket.emit('join', organizerEmail);

        const handleNewMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [userEmail, organizerEmail]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/messages/${userEmail}/${organizerEmail}`);
                setMessages(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError("Failed to load messages.");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [userEmail, organizerEmail]);

    const handleSendMessage = useCallback(async () => {
        if (!message.trim()) return;

        const newMessage = {
            senderEmail: userEmail,
            senderName: userName || 'Unknown',
            receiverEmail: organizerEmail,
            receiverName: organizerName || 'Unknown',
            content: message.trim(),
            timestamp: new Date(),
        };

        console.log("Sending message:", newMessage);

        // Optimistic UI update
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');

        try {
            const response = await axios.post('/send-message', newMessage);
            if (response.status === 200) {
                socket.emit('sendMessage', newMessage);
            } else {
                throw new Error('Message failed to send');
            }
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error);
            setError('Failed to send message. Please try again.');
        }
    }, [message, userEmail, userName, organizerEmail, organizerName]);

    return (
        <div className="chat-container p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">{`Chat with ${organizerName || "Unknown"}`}</h2>
            <div className="messages h-64 overflow-y-auto border p-2">
                {loading ? (
                    <p className="text-gray-400 text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-400 text-center">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`p-2 my-1 rounded ${msg.senderEmail === userEmail ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}>
                            <strong>
                                {msg.senderEmail === userEmail ? 'You' : msg.senderName}:
                            </strong> 
                            {msg.content}
                            <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    ))
                )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex mt-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded p-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
            </div>
        </div>
    );
};

export default Chat;