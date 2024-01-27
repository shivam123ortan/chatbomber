// In ChatMessage.jsx
import React from 'react';
import '../styles/ChatMessage.css'

function ChatMessage({ message }) {
  console.log('Received Message:', message); // Add this line for debugging

  // Extract the message objects from the nested structure
  const messages = Object.values(message);

  return (
    <div className="chat-messages-container">
      {messages.map((msg) => (
        <div key={msg.id} className={`chat-message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
          <span className="message-user">{msg.sender}:</span>
          <span className="message-text">{msg.text}</span>
        </div>
      ))}
    </div>
  );
  
}

export default ChatMessage;
