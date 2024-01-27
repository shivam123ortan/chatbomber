import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { auth, database } from '../firebase'; 
import { ref, onValue, off, push, get, query, orderByChild, equalTo } from 'firebase/database';
import '../styles/ChatApp.css';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [messageListener, setMessageListener] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    console.log('useEffect is triggered!');
    console.log('User:', user);
    console.log('Recipient:', recipient);
  
    // Set up a listener to fetch chat messages and username from the database when the component mounts
    if (user) {
      const messagesRef = ref(database, `messages/${user.uid}/${recipient}`);
      console.log('MessagesRef:', messagesRef);
  
      // Fetch messages using get
      try {
        get(messagesRef).then((snapshot) => {
          console.log('Snapshot:', snapshot.val()); // Debugging: log received snapshot data
  
          if (snapshot.exists()) {
            const messageData = snapshot.val();
            console.log('Message Data:', messageData); // Debugging: log received message data
  
            // Convert messageData into an array
            const messageArray = Object.keys(messageData).map((key) => ({
              id: key,
              ...messageData[key],
            }));
  
            console.log('Updating Messages:', messageArray);
            console.log('Messages Array:', messageArray); // Debugging: log updated message array
  
            // Update the state with the fetched messages
            setMessages(messageArray);
          } else {
            console.log('No data at the specified location'); // Add this line for debugging
            // No messages found, set messages state to an empty array
            setMessages([]);
          }
        }).catch((error) => {
          console.error('Error fetching data:', error);
        });
  
        // Fetch username
        const userRef = ref(database, `users/${user.uid}/username`);
        onValue(userRef, (snapshot) => {
          const userUsername = snapshot.val();
          setUsername(userUsername || 'Guest'); // Set username to 'Guest' if not found
        });
  
        // ... (rest of the code)
      } catch (error) {
        console.error('Error processing data:', error);
      }
    }
  }, [user, recipient, messages]);
  
  
  
  
  

  const handleSendMessage = async () => {
    if (newMessage && recipient) {
      if (user) {
        const userRef = ref(database, 'users');
        const recipientQuery = query(
          userRef,
          orderByChild('username'),
          equalTo(recipient)
        );
  
        try {
          const recipientSnapshot = await get(recipientQuery);
          if (!recipientSnapshot.exists()) {
            console.error('Recipient username does not exist.');
            return;
          }
  
          const recipientUid = Object.keys(recipientSnapshot.val())[0];
          const messageData = {
            sender: username,
            text: newMessage,
          };
  
          // Use direct UIDs instead of querying them
          const recipientChatRef = ref(database, `messages/${recipientUid}/${user.uid}`);
          const senderChatRef = ref(database, `messages/${user.uid}/${recipientUid}`);
          const newMessageRefRecipient = push(recipientChatRef, messageData);
          const newMessageRefSender = push(senderChatRef, messageData);
          setNewMessage('');
        } catch (error) {
          console.error('Error querying recipient:', error);
        }
      } else {
        console.error('User not authenticated.');
      }
    }
  };
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // const handleGuestSignUp = async () => {
  //   try {
  //     // Sign up as a guest (you can customize this logic based on your requirements)
  //     // For example, you can create a new guest account and set the username as 'Guest'
  //     // Here, we're just setting the username to 'Guest' without creating a new account
  //     setUsername('Guest');
  //   } catch (error) {
  //     // Handle guest sign-up error, if any
  //     console.error('Error signing up as a guest:', error.message);
  //   }
  // };
  return (
    <div className="chat-app">
      <h2 className="chat-header">Welcome, {username}</h2>
      <div className="chat-input-container">
        <input
          className="recipient-input"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient"
        />
        <input
          className="message-input"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
      {/* <button className="guest-signup-button" onClick={handleGuestSignUp}>
        Sign Up as Guest
      </button> */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
  
      <div className="chat-messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
  
  
}
export default ChatApp;
