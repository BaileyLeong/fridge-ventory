import { formatDateForDisplay } from "../../utils/utils.js";
import { Favorite, FavoriteBorder, Delete } from "@mui/icons-material";
import "./MealCard.scss";

const MealCard = ({
  meal,
  selectedDate,
  availableDates,
  onUpdateMealDate,
  onDeleteMeal,
  onAddToFavorites,
}) => {
  return (
    <li className="meal-planner__item">
      <div className="meal-planner__info">
        <div className="meal-planner__image-container">
          <img
            className="meal-planner__image"
            src={meal.image_url || "https://via.placeholder.com/150"}
            alt={meal.name}
          />
        </div>
        <div className="meal-planner__details">
          <p className="meal-planner__name">{meal.name}</p>
          <p className="meal-planner__date">
            Planned for: {formatDateForDisplay(selectedDate || meal.meal_date)}
          </p>

          <select
            className="meal-planner__select"
            value={selectedDate || meal.meal_date}
            onChange={(e) =>
              onUpdateMealDate(
                meal.id,
                e.target.value,
                meal.recipe_id,
                meal.meal_type
              )
            }
          >
            {availableDates.map((date) => {
              const formattedDate = formatDateForDisplay(date);
              return (
                <option key={date} value={date}>
                  {formattedDate}
                </option>
              );
            })}
          </select>
          <button
            className="meal-planner__button meal-planner__button--favorite"
            onClick={() => onAddToFavorites(meal.recipe_id)}
          >
            Add to Favorites
          </button>
          <button
            className="meal-planner__button meal-planner__button--delete"
            onClick={() => onDeleteMeal(meal.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default MealCard;
