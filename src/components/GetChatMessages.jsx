import { db } from './firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

// Function to get chat messages
const getChatMessages = async () => {
  try {
    const chatRef = collection(db, 'chats');
    const q = query(chatRef, orderBy('timestamp')); // Order by timestamp or another relevant field
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => doc.data());
    return messages;
  } catch (error) {
    // Handle error, e.g., display an error message
    console.error('Error fetching chat messages:', error.message);
    return [];
  }
};

export default getChatMessages;
