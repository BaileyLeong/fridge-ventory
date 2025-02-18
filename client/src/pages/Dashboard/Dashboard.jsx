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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>

      <section className="dashboard__section dashboard__section--fridge">
        <h2 className="dashboard__heading">Fridge Inventory</h2>
        {fridgeItems.length === 0 ? (
          <p className="dashboard__message">No items in your fridge yet.</p>
        ) : (
          <div className="fridge-items">
            {fridgeItems.map((item) => (
              <div key={item.id} className="fridge-items__item">
                <img
                  className="fridge-items__image"
                  src={item.image_url}
                  alt={item.name}
                />
                <p className="fridge-items__name">{item.name}</p>
              </div>
            ))}
          </div>
        )}

        <h3 className="dashboard__subheading">Expiring Soon</h3>
        <ul className="dashboard__list dashboard__list--expiring">
          {expiringSoon.map((item) => (
            <li key={item.id} className="dashboard__list-item">
              {item.name} (Expires: {formatDate(item.expires_at)})
            </li>
          ))}
        </ul>
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
              {meal.name} on {meal.meal_date}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
