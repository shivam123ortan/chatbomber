import { db } from './firebase';

// Function to save a chat message
const saveChatMessage = async (message) => {
  try {
    const chatRef = collection(db, 'chats');
    await addDoc(chatRef, message);
    // Message saved successfully
  } catch (error) {
    // Handle error, e.g., display an error message
    console.error('Error saving chat message:', error.message);
  }
};

export default saveChatMessage;
