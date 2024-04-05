import { useSocketContext } from "../../context/SocketContext";
import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, IsLastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const IsSelected = selectedConversation?.UserId === conversation.UserId;
  const { onlineUsers } = useSocketContext();
  const IsOnline = onlineUsers.includes(conversation.UserId);
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
        ${IsSelected ? "bg-sky-500" : ""}
      `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${IsOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.ProfilePic} alt="user acatar"></img>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.FullName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>
      {!IsLastIdx ? <div className="divider my-0 py-0 h-1"></div> : null}
    </>
  );
};

export default Conversation;
