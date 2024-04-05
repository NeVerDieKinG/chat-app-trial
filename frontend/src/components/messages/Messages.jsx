import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { Loading, messages } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  useEffect(() => {
    // setTimeout for rendering delay
    setTimeout(() => {
      // If last message is not shown => scroll to bottom to show it
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!Loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message.MessageId} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
      {Loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!Loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
