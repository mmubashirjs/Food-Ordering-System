import api from "./axios";

export const getFoods = () => api.get("/foods");


export const addFood = (data) => api.post("/foods/add", data);


export const updateFood = (id, data) => api.put(`/foods/${id}`, data);


export const deleteFood = (id) => api.delete(`/foods/${id}`);