import { useState } from "react";
import { formatDateForDisplay } from "../../utils/utils.js";
import "./MealListMobile.scss";

const MealListMobile = ({
  meal,
  selectedDate,
  availableDates,
  onUpdateMealDate,
  onDeleteMeal,
  onAddToFavorites,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDateChange = (newDate) => {
    onUpdateMealDate(meal.id, newDate, meal.recipe_id, meal.meal_type);
  };

  return (
    <>
      <li
        className="meal-list-mobile__item"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="meal-list-mobile__info">
          <p className="meal-list-mobile__name">{meal.name}</p>
          <p className="meal-list-mobile__date">
            Planned for: {formatDateForDisplay(selectedDate || meal.meal_date)}
          </p>
        </div>
      </li>
      {isDetailsOpen && (
        <div className="meal-list-mobile__modal">
          <div className="meal-list-mobile__modal-content">
            <button
              className="meal-list-mobile__close-button"
              onClick={() => setIsDetailsOpen(false)}
            >
              ×
            </button>
            <h2 className="meal-list-mobile__modal-title">{meal.name}</h2>
            <img
              src={meal.image_url || "https://via.placeholder.com/150"}
              alt={meal.name}
              className="meal-list-mobile__image"
            />
            <div className="meal-list-mobile__date-picker">
              <label htmlFor="date">Change Date:</label>
              <select
                id="date"
                value={selectedDate || meal.meal_date}
                onChange={(e) => handleDateChange(e.target.value)}
              >
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDateForDisplay(date)}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="meal-list-mobile__action-button"
              onClick={() => onAddToFavorites(meal.recipe_id)}
            >
              Add to Favorites
            </button>
            <button
              className="meal-list-mobile__action-button meal-list-mobile__action-button--delete"
              onClick={() => onDeleteMeal(meal.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MealListMobile;
