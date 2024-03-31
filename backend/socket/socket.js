import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Input userId => get SocketId
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {}; // {userId, socketId}

// Create socket for listening to event in client side
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // get the userId sent from client side once the connection is established
  const userId = socket.handshake.query.userId;
  // Store down socketId => userId
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // to send event to all clients
  // send all online user name
  // each time have "connection" => it emit all online userId to client that is listening to event "getOnlineUsers"
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is ued to listen to the event, can be used on both server and client side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
