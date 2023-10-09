import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'; // Import the necessary Firebase functions
import { auth, database } from '../firebase'; // Import the auth and database objects
import { ref, set, get } from 'firebase/database'; // Import the necessary Firebase Realtime Database functions

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleSignUp = async () => {
    const auth = getAuth(); // Initialize Firebase Authentication

    // Reset error messages
    setEmailError('');
    setUsernameError('');
    setSignupError('');

    // Check if the email is already in use
    const emailMethods = await fetchSignInMethodsForEmail(auth, email);
    if (emailMethods && emailMethods.length > 0) {
      setEmailError('Email is already in use.');
      return;
    }

    // Check if the username is already in use
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setUsernameError('Username is already in use.');
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with full name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Store the user's information in the database
      const userId = user.uid;
      const userRef = ref(database, `users/${userId}`);
      const userData = {
        email: user.email,
        fullName: fullName,
        username: username,
      };
      await set(userRef, userData);

      // User signed up successfully
      console.log(
        'User registered:',
        user.email,
        'Full Name:',
        fullName,
        'Username:',
        username
      );

      // Reset form fields
      setEmail('');
      setPassword('');
      setFullName('');
      setUsername('');
    } catch (error) {
      // Handle sign-up error, e.g., display an error message
      console.error('Error signing up:', error.message);
      setSignupError(error.message); // Set the error message to be displayed
    }
  };

  // Function to check if the username is already in use
  const checkUsernameExists = async (desiredUsername) => {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
      for (const userId in usersData) {
        if (usersData[userId].username === desiredUsername) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {signupError && <p className="error">{signupError}</p>} {/* Display the error message */}
      <div>
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="error">{usernameError}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {emailError && <p className="error">{emailError}</p>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

export default SignUp;
