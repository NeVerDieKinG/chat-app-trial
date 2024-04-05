import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emoji";
import Conversation from "./Conversation";

const Conversations = () => {
  const { Loading, conversations } = useGetConversations();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation.ConversationId}
          conversation={conversation}
          emoji={getRandomEmoji()}
          IsLastIdx={idx === conversations.length - 1}
        />
      ))}
    </div>
  );
};

export default Conversations;
