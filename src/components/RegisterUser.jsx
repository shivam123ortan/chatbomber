import { auth } from '../firebase'; // Import the auth object from your Firebase configuration file

// Function to handle user registration
const registerUser = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // User registered successfully
    const user = userCredential.user;
    console.log('User registered:', user.email);
    return user;
  } catch (error) {
    // Handle registration error, e.g., display an error message
    console.error('Error registering user:', error.message);
    throw error; // Optional: Rethrow the error for further handling in the calling code
  }
};

export default registerUser;
