import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      axios
        .get('/profile')
        .then(({ data }) => {
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);
  const logout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem('token'); // Remove token or any other persisted data
    console.log("User logged out:", user); // Debug log
  };
  
  

  const login = async (userData) => {
    setUser(userData);
    // Optionally store auth token if your API provides one
    // localStorage.setItem('token', userData.token);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
