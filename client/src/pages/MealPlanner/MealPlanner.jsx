import { useEffect, useState } from "react";
import {
  fetchMealPlan,
  updateMealInPlan,
  deleteMealFromPlan,
  fetchRecipes,
  addFavoriteRecipe,
} from "../../api/apiClient";
import "./MealPlanner.scss";
import { formatDateForDisplay } from "../../utils/utils.js";

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});

  useEffect(() => {
    fetchMealPlan()
      .then((response) => {
        setMealPlan(response.data);
        const initialDates = response.data.reduce((acc, meal) => {
          acc[meal.id] = meal.meal_date;
          return acc;
        }, {});
        setSelectedDates(initialDates);
      })
      .catch((error) => console.error("Error fetching meal plan:", error));

    fetchRecipes()
      .then((response) => setAvailableRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

    // Generate the next 7 days for selection
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toLocaleDateString("en-US");
    });

    setAvailableDates(dates);
  }, []);

  const handleUpdateMealDate = (id, newDate, recipeId, mealType) => {
    const localDate = new Date(newDate);
    const utcDate = new Date(
      localDate.getTime() + localDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    updateMealInPlan(id, {
      recipe_id: recipeId,
      meal_type: mealType,
      date: utcDate,
    })
      .then(() => {
        setSelectedDates((prev) => ({ ...prev, [id]: newDate }));
        return fetchMealPlan();
      })
      .then((response) => setMealPlan(response.data))
      .catch((error) => console.error("Error updating meal date:", error));
  };

  const handleDeleteMeal = (id) => {
    deleteMealFromPlan(id)
      .then(() =>
        fetchMealPlan().then((response) => setMealPlan(response.data))
      )
      .catch((error) => console.error("Error deleting meal:", error));
  };

  const handleAddToFavorites = (recipeId) => {
    addFavoriteRecipe(recipeId).catch((error) =>
      console.error("Error adding to favorites:", error)
    );
  };

  return (
    <div className="meal-planner">
      <h1 className="meal-planner__title">Meal Planner</h1>
      <ul className="meal-planner__list">
        {mealPlan.map((meal) => (
          <li key={meal.id} className="meal-planner__item">
            <div className="meal-planner__info">
              <img
                className="meal-planner__image"
                src={meal.image_url || "https://via.placeholder.com/150"}
                alt={meal.name}
              />
              <div className="meal-planner__details">
                <p className="meal-planner__name">{meal.name}</p>
                <p className="meal-planner__date">
                  Planned for:{" "}
                  {formatDateForDisplay(
                    selectedDates[meal.id] || meal.meal_date
                  )}
                </p>
                <select
                  className="meal-planner__select"
                  value={selectedDates[meal.id] || meal.meal_date}
                  onChange={(e) =>
                    handleUpdateMealDate(
                      meal.id,
                      e.target.value,
                      meal.recipe_id,
                      meal.meal_type
                    )
                  }
                >
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDateForDisplay(date)}
                    </option>
                  ))}
                </select>
                <button
                  className="meal-planner__button meal-planner__button--favorite"
                  onClick={() => handleAddToFavorites(meal.recipe_id)}
                >
                  Add to Favorites
                </button>
                <button
                  className="meal-planner__button meal-planner__button--delete"
                  onClick={() => handleDeleteMeal(meal.id)}
                >
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
