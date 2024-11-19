import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

//   const updateUser = (newUser) => {
//     setUser(newUser);
//     localStorage.setItem('user', JSON.stringify(newUser));
//   };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};