import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import io from "socket.io-client"

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    
    if(!accessToken) {
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: accessToken
      }
    });

    newSocket.on('connect', () => {
        console.log('Connected');
    });

    setSocket(newSocket);
    
    return () => {
        newSocket.disconnect();
    };
  }, [accessToken]);

  const value = {
    socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};