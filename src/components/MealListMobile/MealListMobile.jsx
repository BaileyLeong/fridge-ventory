import { useState, useEffect } from "react";
import { Favorite, FavoriteBorder, Delete } from "@mui/icons-material";
import { formatDateForDisplay } from "../../utils/utils.js";
import "./MealListMobile.scss";

const MealListMobile = ({
  meal,
  favorites,
  selectedDate,
  availableDates,
  onUpdateMealDate,
  onDeleteMeal,
  onToggleFavorite,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(favorites.some((fav) => fav.id === meal.recipe_id));
  }, [favorites, meal.recipe_id]);

  const handleDateChange = (newDate) => {
    onUpdateMealDate(meal.id, newDate, meal.recipe_id, meal.meal_type);
  };

  return (
    <>
      <li className="meal-list-mobile__item">
        <div
          className="meal-list-mobile__info"
          onClick={() => setIsDetailsOpen(true)}
        >
          <p className="meal-list-mobile__name">{meal.name}</p>
          <p className="meal-list-mobile__date">
            Planned for: {formatDateForDisplay(selectedDate || meal.meal_date)}
          </p>
        </div>
        <div className="meal-list-mobile__actions">
          <button
            className="meal-list-mobile__action-button"
            onClick={() => onToggleFavorite(meal.recipe_id)}
          >
            {isFavorited ? (
              <Favorite className="meal-planner__icon meal-planner__icon--favorite" />
            ) : (
              <FavoriteBorder className="meal-planner__icon" />
            )}
          </button>

          <button
            className="meal-list-mobile__action-button meal-list-mobile__action-button--delete"
            onClick={() => onDeleteMeal(meal.id)}
            aria-label="Delete Meal"
          >
            <Delete className="meal-planner__icon meal-planner__icon--delete" />
          </button>
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
            <p className="meal-list-mobile__info">
              ⏳ Ready in {meal.ready_in_minutes} minutes | 🍽 Serves{" "}
              {meal.servings}
            </p>
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
            <a
              href={meal.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="meal-planner__source-link"
            >
              View Full Recipe
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default MealListMobile;
