import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const Chat = ({ userEmail, organizerEmail }) => {
   const [messages, setMessages] = useState([]);
   const [messageContent, setMessageContent] = useState("");
   const socket = io("http://localhost:4000"); // Adjust the URL as needed

   useEffect(() => {
      const fetchMessages = async () => {
         const response = await axios.get(`/messages/${userEmail}/${organizerEmail}`);
         setMessages(response.data);
      };

      fetchMessages();

      // Listen for incoming messages
      socket.on("receiveMessage", (message) => {
         setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
         socket.off("receiveMessage");
      };
   }, [userEmail, organizerEmail, socket]);

   const sendMessage = async () => {
      await axios.post("/send-message", { senderEmail: userEmail, receiverEmail: organizerEmail, content: messageContent });
      setMessageContent(""); // Clear the input
   };

   return (
      <div>
         <div>
            {messages.map((msg) => (
               <div key={msg._id}>
                  <strong>{msg.senderEmail === userEmail ? "You" : "Organizer"}:</strong> {msg.content}
               </div>
            ))}
         </div>
         <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
         />
         <button onClick={sendMessage}>Send</button>
      </div>
   );
};

export default Chat;