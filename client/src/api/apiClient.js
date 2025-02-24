import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const userId = "1";

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: { "user-id": userId },
});

// Fridge API
export const fetchFridgeItems = () => apiClient.get("/fridge");
export const addFridgeItem = (item) => apiClient.post("/fridge", item);
export const updateFridgeItem = (id, updates) =>
  apiClient.patch(`/fridge/${id}`, updates);
export const deleteFridgeItem = (id) => apiClient.delete(`/fridge/${id}`);
export const moveGroceryToFridge = (id) => apiClient.post(`/fridge/move/${id}`);
export const useMealIngredients = (id) =>
  apiClient.post(`/fridge/use-meal/${id}`);

// Grocery List API
export const fetchGroceryList = () => apiClient.get("/grocery");
export const addGroceryItem = (item) => apiClient.post("/grocery", item);
export const removeGroceryItem = (id, config = {}) =>
  apiClient.delete(`/grocery/${id}`, config);
export const markGroceryItemComplete = (id, completed) =>
  apiClient.patch(`/grocery/${id}`, { completed });

// Meal Plan API
export const fetchMealPlan = () => apiClient.get("/meal-plan");
export const addMealToPlan = (meal) => apiClient.post("/meal-plan", meal);
export const updateMealInPlan = (id, mealUpdates) =>
  apiClient.put(`/meal-plan/${id}`, mealUpdates);
export const deleteMealFromPlan = (id) => apiClient.delete(`/meal-plan/${id}`);
export const generateMealPlan = (cuisines = [], mealTypes = []) =>
  apiClient.post("/meal-plan/generate", { cuisines, mealTypes });

// Recipes API
export const fetchRecipes = () => apiClient.get("/recipes");
export const fetchRecipeById = (id) => apiClient.get(`/recipes/${id}`);
export const suggestRecipes = () => apiClient.get("/recipes/suggest");
export const addRecipe = (recipe) => apiClient.post("/recipes", recipe);

// Favorites API
export const fetchFavoriteRecipes = () => apiClient.get("/favorites");
export const addFavoriteRecipe = (recipeId) =>
  apiClient.post("/favorites", { recipe_id: recipeId });
export const removeFavoriteRecipe = (recipeId) =>
  apiClient.delete(`/favorites/${recipeId}`);

// Ingredient Search API
export const searchIngredients = (query) =>
  apiClient.get("/ingredients/search", { params: { query } });

export default apiClient;
