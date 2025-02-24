import { useState } from "react";
import { formatDateForDisplay } from "../../utils/utils.js";
import "../MealSelectionList/MealSelectionList.scss";

const MealSelectionList = ({ generatedMeals, availableDates, onSave }) => {
  const [selectedDates, setSelectedDates] = useState(() => {
    return generatedMeals.reduce((acc, meal) => {
      acc[meal.recipe_id] = meal.meal_date;
      return acc;
    }, {});
  });

  const handleDateChange = (recipeId, newDate) => {
    setSelectedDates((prev) => ({
      ...prev,
      [recipeId]: newDate,
    }));
  };

  const handleSaveMeals = () => {
    const mealsWithDates = generatedMeals.map((meal) => ({
      ...meal,
      meal_date: selectedDates[meal.recipe_id] || meal.meal_date,
    }));
    onSave(mealsWithDates);
  };

  return (
    <div className="meal-selection">
      <h2>Generated Meal Plan</h2>
      <ul className="meal-selection__list">
        {generatedMeals.map((meal) => (
          <li key={meal.recipe_id} className="meal-selection__item">
            <img
              className="meal-selection__image"
              src={meal.image_url}
              alt={meal.name}
            />
            <div className="meal-selection__details">
              <p className="meal-selection__name">{meal.name}</p>
              <label className="meal-selection__label">
                Select Date:
                <select
                  className="meal-selection__date-picker"
                  value={selectedDates[meal.recipe_id]}
                  onChange={(e) =>
                    handleDateChange(meal.recipe_id, e.target.value)
                  }
                >
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDateForDisplay(date)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button className="meal-selection__save-button" onClick={handleSaveMeals}>
        Save Meal Plan
      </button>
    </div>
  );
};

export default MealSelectionList;
