export type order_status = "pending" | "preparing" | "ready";

export interface Order {
  id: number;
  table: number;
  items: string[];
  status: order_status;
  createdAt: number;
  startedAt: number | null;
  readyAt: number | null;
  preparationTime?: number;
}

let lastId = 0;

const orders: Order[] = [];

export const CreateOrder = (table: number, items: string[]): Order | null => {
  if (!table || !items.length) return null;

  const newOrder: Order = {
    id: ++lastId,
    table,
    items,
    status: "pending",
    createdAt: Date.now(),
    startedAt: null,
    readyAt: null,
  };

  orders.push(newOrder);
  return newOrder;
};

// find-order
export const findOrderById = (id: number) =>
  orders.find((o) => {
    o.id === id;
  });

//   active-order
export const ActiveOrder = () =>
  orders.filter((o) => {
    o.status !== "ready";
  });

// preparing Order
export const getPreparingOrders = () =>
  orders.filter((o) => o.status === "preparing");

// Start Preparing
export const startPreparing = (id: number): Order | null => {
  const order = findOrderById(id);
  if (!order || order.status !== "pending") return null;

  order.status = "preparing";
  order.startedAt = Date.now();
  return order;
};

// Mark Ready
export const markReady = (id: number): Order | null => {
  const order = findOrderById(id);
  if (!order || order.status !== "preparing") return null;

  order.status = "ready";
  order.readyAt = Date.now();
  order.preparationTime = order.readyAt - (order.startedAt || order.readyAt);

  return order;
};
