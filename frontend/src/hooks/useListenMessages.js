import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sound/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    // also cater socket not exist => avoid crash
    // Listen to event "newMessage"
    socket?.on("newMessage", (newMessage) => {
      // Add new message to right side message list
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    // If not off each time, it will keep adding event listener
    // after multiple time of messages changed (trigger this function multiple time)
    // the sound effect will be duplicated
    return () => socket?.off("newMessage");
  }, [socket, messages, setMessages]); // what if socket created without conversation selected?
};

export default useListenMessages;
