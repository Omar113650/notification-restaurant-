import { CreateOrder, ActiveOrder } from "../store/order.store.js";

export const handleWaiterEvents = (io: any, socket: any) => {
  socket.on(
    "create_order",
    ({ table, items }: { table: number; items: any[] }) => {
      const order = CreateOrder(table, items);
      if (!order)
        return socket.emit("order_error", { message: "Invalid order data" });

      io.emit("new_order", order);
      socket.emit("order_created", order);
    },
  );

  socket.on("get_active_orders", () => {
    const activeOrders = ActiveOrder();
    socket.emit("active_orders", activeOrders);
  });
};
