import { useEffect, useState } from "react";
import {
  fetchFridgeItems,
  fetchRecipes,
  fetchMealPlan,
} from "../../api/apiClient";
import { formatDateForDisplay } from "../../utils/utils";
import "./Dashboard.scss";
import FoodItem from "../../components/FoodItem/FoodItem";

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

  const expiringSoonItems = fridgeItems.filter((item) => {
    const today = new Date();
    const expiryDate = new Date(item.expires_at);
    const diffInDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 5;
  });

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>

      <section className="dashboard__section dashboard__section--fridge">
        <h2 className="dashboard__heading">Fridge Inventory</h2>
        {fridgeItems.length === 0 ? (
          <p className="dashboard__message">No items in your fridge yet.</p>
        ) : (
          <ul className="dashboard__list dashboard__list--fridge">
            {fridgeItems.map((item) => (
              <FoodItem
                key={item.id}
                item={item}
                readOnly={true}
                updateValues={{}}
                setUpdateValues={() => {}}
                onUpdateQuantity={() => {}}
                onUpdateExpiry={() => {}}
                onDeleteItem={() => {}}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard__section dashboard__section--expiring">
        <h2 className="dashboard__heading">Expiring Soon</h2>
        {expiringSoonItems.length === 0 ? (
          <p className="dashboard__message">No items expiring soon.</p>
        ) : (
          <ul className="dashboard__list dashboard__list--expiring">
            {expiringSoonItems.map((item) => (
              <FoodItem
                key={item.id}
                item={item}
                readOnly={true}
                updateValues={{}}
                setUpdateValues={() => {}}
                onUpdateQuantity={() => {}}
                onUpdateExpiry={() => {}}
                onDeleteItem={() => {}}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard__section dashboard__section--recipes">
        <h2 className="dashboard__heading">Recently Added Recipes</h2>
        <ul className="dashboard__list dashboard__list--recipes">
          {recipes.slice(0, 5).map((recipe) => (
            <li key={recipe.id} className="dashboard__list-item">
              <h3 className="dashboard__recipe-name">{recipe.name}</h3>
              <img
                className="dashboard__recipe-image"
                src={recipe.image || recipe.image_url}
                alt={recipe.name}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard__section dashboard__section--meal-plan">
        <h2 className="dashboard__heading">Meal Plan Highlights</h2>
        <ul className="dashboard__list dashboard__list--meal-plan">
          {mealPlan.slice(0, 5).map((meal) => (
            <li key={meal.id} className="dashboard__list-item">
              {meal.name} on {formatDateForDisplay(meal.meal_date)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
