import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { auth, database } from '../firebase'; // Import the auth and database objects
import { ref, onValue, off, push, get, query, orderByChild, equalTo } from 'firebase/database'; // Import the necessary Firebase Realtime Database functions

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [messageListener, setMessageListener] = useState(null); // Store the listener reference
  const [recipient, setRecipient] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    // Set up a listener to fetch chat messages and username from the database when the component mounts
    if (user) {
      const messagesRef = ref(database, `messages/${user.uid}`); // Reference to the "messages" node under the user's ID

      const listener = onValue(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        if (messageData) {
          const messageArray = Object.keys(messageData).map((key) => ({
            id: key, // Use Firebase-generated key as the unique ID
            ...messageData[key],
          }));
          setMessages(messageArray);
        } else {
          setMessages([]);
        }
      });

      // Store the listener reference to later unsubscribe when the component unmounts
      setMessageListener(listener);

      // Fetch the user's username from the database
      const userRef = ref(database, `users/${user.uid}/username`); // Reference to the user's username
      onValue(userRef, (snapshot) => {
        const userUsername = snapshot.val();
        setUsername(userUsername || 'Guest'); // Set username to 'Guest' if not found
      });

      // Clean up the listeners when the component unmounts
      return () => {
        // Unsubscribe from the message listener using the off function
        if (messageListener) {
          off(messageListener);
        }
      };
    }
  }, [messageListener, user]);

  // ... (previous imports and component code)

const handleSendMessage = async () => {
  // Send a new message to the database
  if (newMessage && recipient) {
    if (user) {
      // Check if the recipient username exists in the database
      const userRef = ref(database, 'users');
      const recipientQuery = query(
        userRef,
        orderByChild('username'),
        equalTo(recipient)
      );

      const recipientSnapshot = await get(recipientQuery);

      if (!recipientSnapshot.exists()) {
        console.error('Recipient username does not exist.');
        return; // Don't send the message if the recipient username doesn't exist
      }

      const recipientUid = Object.keys(recipientSnapshot.val())[0];

      const messageData = {
        sender: username, // Include the sender's username
        text: newMessage,
      };

      // Save the message to the recipient's chat node in the database
      const recipientChatRef = ref(database, `messages/${user.uid}/${recipientUid}`);
      const newMessageRef = push(recipientChatRef, messageData);

      setNewMessage('');
    } else {
      // Handle user not authenticated (not signed in)
      console.error('User not authenticated.');
    }
  }
};

// ... (rest of the component code)


  const handleLogout = async () => {
    try {
      await auth.signOut();
      // User signed out successfully
    } catch (error) {
      // Handle sign-out error, if any
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="chat-app">
      <h2>Welcome, {username}</h2> {/* Display the username */}
      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <button onClick={handleLogout}>Logout</button> {/* Add the logout button */}
    </div>
  );
}

export default ChatApp;
