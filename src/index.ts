import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { handleWaiterEvents } from "./socket/waiter.js";
import { handleKitchenEvents } from "./socket/kitchen.js";
import { getPreparingOrders } from "./store/order.store.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

interface CustomSocket extends Socket {
  role?: "waiter" | "kitchen";
}

io.on("connection", (socket: CustomSocket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join", (role) => {
    socket.role = role;
    console.log(`${socket.id} joined as ${role}`);

    if (role === "waiter") handleWaiterEvents(io, socket);
    if (role === "kitchen") handleKitchenEvents(io, socket);
  });

  socket.on("disconnect", () =>
    console.log(`Client disconnected: ${socket.id}`),
  );
});

setInterval(() => {
  const preparingOrders = getPreparingOrders();
  const now = Date.now();

  preparingOrders.forEach((order) => {
    const elapsed = now - (order.startedAt || now);
    io.emit("preparing_timer", { orderId: order.id, elapsed });
  });
}, 1000);

const port = process.env.PORT;
server.listen(port, () => console.log(`Server running `));
