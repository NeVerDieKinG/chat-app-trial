import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    // req.user is added in protectRoute from info. of cookie
    const senderId = req.user._id;

    // Find existing conversation with Participant = include senderId & receiverId
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If the sending message is the first message between the two users,
    // conversation = empty array
    if (!conversation) {
      // If no previous conversation => create new conversation
      // No need to have message, since it's default = []
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      // If newMessage is successfully created
      // push the newMessage to conversation.message (which is a list)
      conversation.message.push(newMessage._id);
    }

    // SOCKET IO FUNCTIONALITY WILL GO HERE

    // Slower
    // await conversation.save();
    // await newMessage.save();
    // run in parallel => Faster
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("message"); // Not reference, but actual message

    if (!conversation) {
      return res.status(200).json([]);
    }

    const message = conversation.message;
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage controller :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
