import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { AuthUser } = useAuthContext();

  useEffect(() => {
    if (AuthUser) {
      const socket = io("http://localhost:5000", {
        query: {
          UserId: AuthUser.UserId,
        },
      });
      setSocket(socket);
      // socket.on() is ued to listen to the event, can be used on both server and client side
      socket.on("getOnlineUser", (users) => {
        setOnlineUsers(users);
      });

      // For performance reason
      return () => {
        socket.close();
      };
    } else {
      // when not AuthUser => if have existing socket => close it
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [AuthUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
