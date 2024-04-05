import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  const { AuthUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const IsFromMe = message.SendUserId == AuthUser.UserId;
  const chatClassName = IsFromMe ? "chat-end" : "chat-start";
  const ProfilePic = IsFromMe
    ? AuthUser.ProfilePic
    : selectedConversation?.ProfilePic;
  const bubbleBgColor = IsFromMe ? "bg-blue-500" : "";
  const formattedTime = extractTime(message.CreatedAt);
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={ProfilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message.Message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};
export default Message;
