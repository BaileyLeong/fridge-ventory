import { useEffect, useState } from "react";
import {
  fetchFridgeItems,
  fetchRecipes,
  fetchMealPlan,
} from "../../api/apiClient";
import "./Dashboard.scss";

const Dashboard = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);

  useEffect(() => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));

    fetchRecipes()
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

    fetchMealPlan()
      .then((response) => setMealPlan(response.data))
      .catch((error) => console.error("Error fetching meal plan:", error));
  }, []);

  const expiringSoon = fridgeItems.filter((item) => {
    const today = new Date();
    const expiryDate = new Date(item.expires_at);
    const diffInDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 3;
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Fridge Inventory</h2>
      <div className="fridge-items">
        {fridgeItems.map((item) => (
          <div key={item.id} className="fridge-item">
            <img src={item.image_url} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <h3>Expiring Soon</h3>
      <ul>
        {expiringSoon.map((item) => (
          <li key={item.id}>
            {item.name} (Expires: {item.expires_at})
          </li>
        ))}
      </ul>
      <h2>Recently Added Recipes</h2>
      <ul>
        {recipes.slice(0, 5).map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <img src={recipe.image || recipe.image_url} alt={recipe.name} />
          </li>
        ))}
      </ul>
      <h2>Meal Plan Highlights</h2>
      <ul>
        {mealPlan.slice(0, 5).map((meal) => (
          <li key={meal.id}>
            {meal.name} on {meal.meal_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
