import { SocketContext } from "../context/SocketContext.jsx";
import { useContext } from "react";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useAuth must be used within SocketProvider');
  }
  return context;
};