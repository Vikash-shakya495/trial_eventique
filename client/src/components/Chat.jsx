import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // ✅ Ensure single socket connection

const Chat = ({ userEmail, userName, organizerEmail, organizerName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  console.log("Chat Component Props:", { userEmail, organizerEmail });

  useEffect(() => {
    if (!userEmail || !organizerEmail) return <p className="text-red-500">Chat cannot be initialized, missing emails.</p>;

    socket.emit('join', userEmail); // ✅ User joins chat room

    // ✅ Listen for real-time incoming messages
    socket.on('receiveMessage', (newMessage) => {
      console.log('New Message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Update state
    });

    return () => {
      socket.off('receiveMessage'); 
      socket.disconnect();// ✅ Cleanup listener to avoid duplication
    };
  }, [userEmail, organizerEmail]); // ✅ Dependency updated


  useEffect(() => {
    // Fetch previous messages when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/messages/${userEmail}/${organizerEmail}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userEmail, organizerEmail]);

  
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        senderEmail: userEmail,
        receiverEmail: organizerEmail,
        content: message,
        timestamp: new Date(),
      };

      socket.emit('send-message', newMessage); // ✅ Emit message
      setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Optimistically update UI
      setMessage('');
    }
  };

  return (
    <div className="chat-container p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">{`Chat with ${organizerName}`}</h2>
      <div className="messages h-64 overflow-y-auto border p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded ${msg.senderEmail === userEmail ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}>
            <strong>{msg.senderEmail === userEmail ? userName : organizerName}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex mt-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2"
        />
        <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default Chat;
