import api from "./axios";


export const placeOrder = (data) => api.post("/orders/place", data);


export const getOrders = () => api.get("/orders");


export const updateOrderStatus = (id, orderStatus) =>
  api.put(`/orders/${id}`, { orderStatus });
