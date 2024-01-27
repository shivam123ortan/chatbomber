import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Import the auth object
import '../styles/Profile.css'

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>UID: {user.uid}</p>
        </div>
      ) : (
        <p>User not signed in</p>
      )}
    </div>
  );
  
}

export default Profile;
