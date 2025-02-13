import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL; // Make sure this is correctly defined in your .env file
const userId = "1";

export const fetchFridgeItems = () => {
  return axios.get(`${baseUrl}/fridge`, { params: { user_id: userId } });
};

export const addFridgeItem = (itemData) => {
  return axios.post(`${baseUrl}/fridge`, { ...itemData, user_id: userId });
};

export const updateFridgeItem = (id, itemData) => {
  return axios.patch(`${baseUrl}/fridge/${id}`, {
    ...itemData,
    user_id: userId,
  });
};

export const deleteFridgeItem = (id) => {
  return axios.delete(`${baseUrl}/fridge/${id}`, {
    data: { user_id: userId },
  });
};

export const fetchSuggestedRecipes = () => {
  return axios.get(`${baseUrl}/recipes/suggest`, {
    params: { user_id: userId },
  });
};

export const fetchMealPlan = () => {
  return axios.get(`${baseUrl}/meal-plan`, { params: { user_id: userId } });
};

export const addMealToPlan = (mealData) => {
  return axios.post(`${baseUrl}/meal-plan`, { ...mealData, user_id: userId });
};
