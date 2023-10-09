import React from 'react';

function ChatMessage({ message }) {
  return (
    <div className={`chat-message ${message.user === 'You' ? 'sent' : 'received'}`}>
      <span className="message-user">{message.user}:</span>
      <span className="message-text">{message.text}</span>
    </div>
  );
}

export default ChatMessage;
