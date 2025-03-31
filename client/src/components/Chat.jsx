import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000'); // Ensure single socket connection

const Chat = ({ userEmail, userName, organizerEmail, organizerName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state for messages

    useEffect(() => {
        if (!userEmail || !organizerEmail) {
            console.error("Chat cannot be initialized, missing emails.");
            return;
        }

        // Join the chat room for both user and organizer
        socket.emit('join', userEmail); // User joins chat room
        socket.emit('join', organizerEmail); // Organizer joins chat room

        const handleNewMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state
        };

        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [userEmail, organizerEmail]);

    useEffect(() => {
        // Fetch previous messages when the component mounts
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/messages/${userEmail}/${organizerEmail}`);
                setMessages(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchMessages();
    }, [userEmail, organizerEmail]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            senderEmail: userEmail,
            senderName: userName,
            receiverEmail: organizerEmail,
            content: message.trim(),
            timestamp: new Date(),
        };

        // Optimistic UI update
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');

        try {
            const response = await axios.post('/send-message', newMessage);
            if (response.status !== 200) {
                console.error('Message failed to send:', response.data);
            } else {
                // Emit the message to the socket
                socket.emit('sendMessage', newMessage);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">{`Chat with ${organizerName}`}</h2>
            <div className="messages h-64 overflow-y-auto border p-2">
                {loading ? (
                    <p className="text-gray-400 text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-400 text-center">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`p-2 my-1 rounded ${msg.senderEmail === userEmail ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}>
                            <strong>{msg.senderEmail === userEmail ? userName : msg.senderName}:</strong> {msg.content}
                        </div>
                    ))
                )}
            </div>
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