import React, { createContext, useContext, useEffect, useState } from 'react';
import { Authenticator } from '../../sdk/index.js'; // Assuming monorepo access or global

const AuthContext = createContext(null);

export const AuthenticatorProvider = ({ clientId, baseURL, children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authenticator = window.__authenticator;
    if (!authenticator) {
      authenticator = new Authenticator({ clientId, baseURL });
      window.__authenticator = authenticator;
    }
    
    setAuth(authenticator);

    const unsubscribe = authenticator.subscribe((newUser, newLoading) => {
      setUser(newUser);
      setLoading(newLoading);
    });

    authenticator.init();

    return () => {
      unsubscribe();
    };
  }, [clientId, baseURL]);

  return (
    <AuthContext.Provider value={{ auth, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthenticatorProvider');
  }
  return context;
};
