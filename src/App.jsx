import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'; // Import Routes
import './App.css';
import ChatApp from './components/ChatApp';
import SignIn from './components/SignIn'; // Import the SignIn component
import SignUp from './components/SignUp'; // Import the SignUp component
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">ChatBomber</h1>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div className="chat-app-container">
                  <ChatApp />
                </div>
              ) : (
                <div className="auth-forms-container">
                  <SignIn />
                  <SignUp />
                </div>
              )
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
