import React, { useEffect, useState } from "react";
import MealCard from "../../components/MealCard/MealCard.jsx";
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
  const [selectedDates, setSelectedDates] = useState({});

  useEffect(() => {
    fetchMealPlan()
      .then((response) => {
        const sortedMeals = response.data.sort(
          (a, b) => new Date(a.meal_date) - new Date(b.meal_date)
        );
        setMealPlan(sortedMeals);

        const initialDates = sortedMeals.reduce((acc, meal) => {
          acc[meal.id] = meal.meal_date;
          return acc;
        }, {});
        setSelectedDates(initialDates);
      })
      .catch((error) => console.error("Error fetching meal plan:", error));

    fetchRecipes()
      .then((response) => setAvailableRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

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

  const groupedMeals = mealPlan.reduce((groups, meal) => {
    const dateKey = selectedDates[meal.id] || meal.meal_date;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meal);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMeals).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <section className="meal-planner__container">
      <h1 className="meal-planner__title">Meal Planner</h1>
      <div className="meal-planner">
        {sortedDates.map((date) => {
          const mealsForDate = groupedMeals[date];
          const remainder = mealsForDate.length % 3;
          const spacersNeeded = remainder ? 3 - remainder : 0;
          return (
            <div key={date} className="meal-planner__group">
              <h2 className="meal-planner__group-title">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </h2>
              <ul className="meal-planner__list">
                {mealsForDate.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    selectedDate={selectedDates[meal.id]}
                    availableDates={availableDates}
                    onUpdateMealDate={handleUpdateMealDate}
                    onDeleteMeal={handleDeleteMeal}
                    onAddToFavorites={handleAddToFavorites}
                    className="meal-planner__list-item"
                  />
                ))}
                {Array.from({ length: spacersNeeded }).map((_, index) => (
                  <li
                    key={`spacer-${index}`}
                    className="meal-planner__spacer"
                  ></li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MealPlanner;
