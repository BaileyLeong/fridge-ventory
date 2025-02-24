import "../MealCard/MealCard.scss";
import { formatDateForDisplay } from "../../utils/utils.js";

const MealDetailsDesktop = ({
  meal,
  onClose,
  selectedDate,
  availableDates,
  onUpdateMealDate,
}) => {
  console.log("Steps Data:", meal.steps);

  return (
    <div className="meal-planner__item">
      <div className="meal-planner__info">
        <button className="meal-planner__close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="meal-planner__name">{meal.name}</h2>
        <img
          src={meal.image_url || "https://via.placeholder.com/150"}
          alt={meal.name}
          className="meal-planner__image"
        />
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
        <a
          href={meal.steps}
          target="_blank"
          rel="noopener noreferrer"
          className="meal-planner__source-link"
        >
          View Full Recipe
        </a>
      </div>
    </div>
  );
};

export default MealDetailsDesktop;
