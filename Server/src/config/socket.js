import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.io] User joined room: user_${userId}`);
      }
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
