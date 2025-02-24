import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchFridgeItems,
  fetchRecipes,
  fetchMealPlan,
} from "../../api/apiClient";
import { formatDateForDisplay } from "../../utils/utils";
import "../Dashboard/Dashboard.scss";
import FoodItem from "../../components/FoodItem/FoodItem";

const Dashboard = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const maxItems = 6;

  useEffect(() => {
    fetchFridgeItems()
      .then((response) => setFridgeItems(response.data))
      .catch((error) => console.error("Error fetching fridge items:", error));

    fetchRecipes()
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

    fetchMealPlan()
      .then((response) => {
        setMealPlan(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching meal plan:", error);
        setMealPlan([]);
      });
  }, []);

  const expiringSoonItems = fridgeItems.filter((item) => {
    const today = new Date();
    const expiryDate = new Date(item.expires_at);
    const diffInDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 5;
  });

  const itemsPerRow = 3;

  return (
    <section className="dashboard">
      <article className="dashboard__container">
        <h1 className="dashboard__title">Dashboard</h1>

        <section className="dashboard__section dashboard__section--fridge">
          <h2 className="dashboard__heading">Fridge Inventory</h2>
          {fridgeItems.length === 0 ? (
            <p className="dashboard__message">No items in your fridge yet.</p>
          ) : (
            <>
              <ul className="dashboard__grid">
                {fridgeItems.slice(0, maxItems).map((item) => (
                  <li key={item.id} className="dashboard__grid-item">
                    <FoodItem
                      item={item}
                      readOnly={true}
                      updateValues={{}}
                      setUpdateValues={() => {}}
                      onUpdateQuantity={() => {}}
                      onUpdateExpiry={() => {}}
                      onDeleteItem={() => {}}
                    />
                  </li>
                ))}
                {Array.from({
                  length:
                    (itemsPerRow -
                      (fridgeItems.slice(0, maxItems).length % itemsPerRow)) %
                    itemsPerRow,
                }).map((_, index) => (
                  <li
                    key={`spacer-${index}`}
                    className="dashboard__grid-item dashboard__grid-item--spacer"
                  />
                ))}
              </ul>
              {fridgeItems.length > maxItems && (
                <Link to="/fridge" className="dashboard__view-more">
                  View More
                </Link>
              )}
            </>
          )}
        </section>

        <section className="dashboard__section dashboard__section--expiring">
          <h2 className="dashboard__heading">Expiring Soon</h2>
          {expiringSoonItems.length === 0 ? (
            <p className="dashboard__message">No items expiring soon.</p>
          ) : (
            <>
              <ul className="dashboard__grid">
                {expiringSoonItems.slice(0, maxItems).map((item) => (
                  <li key={item.id} className="dashboard__grid-item">
                    <FoodItem
                      item={item}
                      readOnly={true}
                      updateValues={{}}
                      setUpdateValues={() => {}}
                      onUpdateQuantity={() => {}}
                      onUpdateExpiry={() => {}}
                      onDeleteItem={() => {}}
                    />
                  </li>
                ))}
              </ul>
              {expiringSoonItems.length > maxItems && (
                <Link
                  to="/fridge?sort=expiring"
                  className="dashboard__view-more"
                >
                  View More
                </Link>
              )}
            </>
          )}
        </section>
        <section className="dashboard__section dashboard__section--meal-plan">
          <h2 className="dashboard__heading">Meal Plan Highlights</h2>
          {Array.isArray(mealPlan) && mealPlan.length > 0 && (
            <ul className="dashboard__list dashboard__list--meal-plan">
              {mealPlan.slice(0, 5).map((meal) => (
                <li key={meal.id} className="dashboard__list-item">
                  <h3 className="dashboard__recipe-name">
                    {formatDateForDisplay(meal.meal_date)}
                  </h3>
                  <img
                    className="dashboard__recipe-image"
                    src={meal.image || meal.image_url}
                    alt={meal.name}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="dashboard__section dashboard__section--recipes">
          <h2 className="dashboard__heading">Recently Added Recipes</h2>
          {Array.isArray(recipes) && recipes.length > 0 ? (
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
          ) : (
            <p className="dashboard__fallback">No recipes added yet.</p>
          )}
        </section>
      </article>
    </section>
  );
};

export default Dashboard;
