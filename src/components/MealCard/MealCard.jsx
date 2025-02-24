import { formatDateForDisplay } from "../../utils/utils.js";
import { Favorite, FavoriteBorder, Delete } from "@mui/icons-material";
import "./MealCard.scss";
import { useEffect, useState } from "react";
import MealDetailsDesktop from "../MealDetailsDesktop/MealDetailsDesktop.jsx";

const MealCard = ({
  meal,
  favorites,
  selectedDate,
  availableDates,
  onUpdateMealDate,
  onDeleteMeal,
  onToggleFavorite,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setIsFavorited(favorites.some((fav) => fav.id === meal.recipe_id));
  }, [favorites, meal.recipe_id]);

  if (showDetails) {
    return (
      <MealDetailsDesktop
        meal={meal}
        onClose={() => setShowDetails(false)}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onUpdateMealDate={onUpdateMealDate}
      />
    );
  }

  return (
    <li className="meal-planner__item">
      <div className="meal-planner__info">
        <div className="meal-planner__image-container">
          <img
            className="meal-planner__image"
            src={meal.image_url || "https://via.placeholder.com/500"}
            alt={meal.name}
          />
        </div>
        <div className="meal-planner__details">
          <p className="meal-planner__name">{meal.name}</p>
          <p className="meal-planner__date">
            Planned for: {formatDateForDisplay(selectedDate || meal.meal_date)}
          </p>
          <div className="meal-planner__actions">
            <button
              className="meal-planner__button meal-planner__button--favorite"
              onClick={() => onToggleFavorite(meal.recipe_id)}
            >
              {isFavorited ? (
                <Favorite className="meal-planner__icon meal-planner__icon--favorite" />
              ) : (
                <FavoriteBorder className="meal-planner__icon" />
              )}
            </button>
            <button
              className="meal-planner__button meal-planner__button--delete"
              onClick={() => onDeleteMeal(meal.id)}
              aria-label="Delete Meal"
            >
              <Delete className="meal-planner__icon meal-planner__icon--delete" />
            </button>
            <button
              className="meal-planner__button meal-planner__button--details"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MealCard;
