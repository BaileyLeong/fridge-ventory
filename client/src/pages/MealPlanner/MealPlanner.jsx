import { useEffect, useState } from "react";
import {
  fetchMealPlan,
  updateMealInPlan,
  deleteMealFromPlan,
  fetchRecipes,
  addFavoriteRecipe,
} from "../../api/apiClient";
import "./MealPlanner.scss";

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchMealPlan()
      .then((response) => setMealPlan(response.data))
      .catch((error) => console.error("Error fetching meal plan:", error));

    fetchRecipes()
      .then((response) => setAvailableRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

    // Generate the next 7 days for selection
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    setAvailableDates(dates);
  }, []);

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const handleUpdateMealDate = (id, newDate) => {
    updateMealInPlan(id, { meal_date: newDate })
      .then(() =>
        fetchMealPlan().then((response) => setMealPlan(response.data))
      )
      .catch((error) => console.error("Error updating meal date:", error));
  };

  const handleDeleteMeal = (id) => {
    deleteMealFromPlan(id)
      .then(() =>
        fetchMealPlan().then((response) => setMealPlan(response.data))
      )
      .catch((error) => console.error("Error deleting meal:", error));
  };

  return (
    <div>
      <h1>Meal Planner</h1>
      <ul className="meal-list">
        {mealPlan.map((meal) => (
          <li key={meal.id} className="meal-item">
            <div className="meal-info">
              <img
                src={meal.image_url || "https://via.placeholder.com/150"}
                alt={meal.name}
                className="meal-image"
              />
              <div className="meal-details">
                <p>{meal.name}</p>

                <select
                  value={meal.meal_date}
                  onChange={(e) =>
                    handleUpdateMealDate(meal.id, e.target.value)
                  }
                >
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDateDisplay(date)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    addFavoriteRecipe({ recipe_id: meal.recipe_id })
                  }
                >
                  Add to Favorites
                </button>
                <button onClick={() => handleDeleteMeal(meal.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlanner;
