import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const userId = "1";

// Fridge API
export const fetchFridgeItems = () =>
  axios.get(`${baseUrl}/api/fridge`, { params: { user_id: userId } });
export const addFridgeItem = (itemData) =>
  axios.post(`${baseUrl}/api/fridge`, { ...itemData, user_id: userId });
export const updateFridgeItem = (id, itemData) =>
  axios.patch(`${baseUrl}/api/fridge/${id}`, { ...itemData, user_id: userId });
export const deleteFridgeItem = (id) =>
  axios.delete(`${baseUrl}/api/fridge/${id}`, { data: { user_id: userId } });

// Recipes API
export const fetchRecipes = () => {
  return axios.get(`${baseUrl}/api/recipes`, { params: { user_id: userId } });
};
export const fetchSuggestedRecipes = () =>
  axios.get(`${baseUrl}/api/recipes/suggest`, { params: { user_id: userId } });
export const addRecipe = (recipeData) => {
  return axios.post(`${baseUrl}/api/recipes`, {
    ...recipeData,
    user_id: userId,
  });
};

// Meal Plan API
export const fetchMealPlan = () =>
  axios.get(`${baseUrl}/api/meal-plan`, { params: { user_id: userId } });
export const addMealToPlan = (mealData) => {
  return axios.post(`${baseUrl}/api/meal-plan`, {
    ...mealData,
    user_id: userId,
  });
};
export const updateMealInPlan = (id, mealData) =>
  axios.put(`${baseUrl}/api/meal-plan/${id}`, { ...mealData, user_id: userId });
export const deleteMealFromPlan = (id) =>
  axios.delete(`${baseUrl}/api/meal-plan/${id}`, { data: { user_id: userId } });

// Grocery List API
export const fetchGroceryList = () => {
  return axios.get(`${baseUrl}/api/grocery-list`, {
    params: { user_id: userId },
  });
};
export const addItemToGroceryList = (itemData) =>
  axios.post(`${baseUrl}/api/grocery-list`, { ...itemData, user_id: userId });
export const updateGroceryListItem = (id, itemData) =>
  axios.patch(`${baseUrl}/api/grocery-list/${id}`, {
    ...itemData,
    user_id: userId,
  });
export const deleteGroceryListItem = (id) =>
  axios.delete(`${baseUrl}/api/grocery-list/${id}`, {
    data: { user_id: userId },
  });

// Favorites API
export const fetchFavoriteRecipes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/favorites`, {
      params: { user_id: userId },
    });

    console.log("Fetched favorite recipes:", response.data); // Debugging log

    return response.data; // Directly return full recipe details
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return [];
  }
};

export const addFavoriteRecipe = (recipeData) =>
  axios.post(`${baseUrl}/api/favorites`, { ...recipeData, user_id: userId });
export const removeFavoriteRecipe = (id) =>
  axios.delete(`${baseUrl}/api/favorites/${id}`, { data: { user_id: userId } });
