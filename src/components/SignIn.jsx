import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import the necessary Firebase functions
import { auth } from '../firebase'; // Import the auth object

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const auth = getAuth(); // Initialize Firebase Authentication
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User signed in successfully
    } catch (error) {
      // Handle sign-in error, e.g., display an error message
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}

export default SignIn;
