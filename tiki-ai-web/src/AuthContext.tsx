import React, { createContext, useContext, ReactNode, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const useAuth = () => useContext(AuthContext);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem('userToken')) // If there's a token, the user is logged in
  );

  
  const login = () => setIsLoggedIn(true);
    const logout = () => {
        localStorage.removeItem('userData'); // Clear user data from local storage on logout
        setIsLoggedIn(false); // Update the login state
    };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
