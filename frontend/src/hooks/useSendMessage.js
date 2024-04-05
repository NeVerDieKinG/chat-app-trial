import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [Loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (Message) => {
    // Loading to server
    setLoading(true);
    try {
      console.log(selectedConversation);
      const res = await fetch(
        `/api/message/send/${selectedConversation.UserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Message,
          }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { Loading, sendMessage };
};

export default useSendMessage;
