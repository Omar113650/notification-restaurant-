import { startPreparing, markReady } from "../store/order.store.js";

export const handleKitchenEvents = (io: any, socket: any) => {
  socket.on("start_preparing", (orderId: number) => {
    const order = startPreparing(orderId);
    if (!order)
      return socket.emit("order_error", { message: "Invalid order or state" });

    io.emit("order_updated", order);
  });

  socket.on("order_ready", (orderId: number) => {
    const order = markReady(orderId);
    if (!order)
      return socket.emit("order_error", { message: "Invalid order or state" });

    io.emit("order_updated", order);
  });
};
