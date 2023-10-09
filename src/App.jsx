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
      <div className="App">
        <h1>My Chat Application</h1>

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={user ? <ChatApp /> : <div><SignIn /><SignUp /></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
