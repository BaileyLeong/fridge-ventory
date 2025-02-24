import { useState } from "react";
import { CUISINE_OPTIONS, MEAL_TYPE_OPTIONS } from "../../utils/utils";
import "../MealPlanModal/MealPlanModal.scss";

const MealPlanModal = ({ isOpen, onClose, onGenerate }) => {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);

  const handleSubmit = async () => {
    try {
      await onGenerate(selectedCuisines, selectedMealTypes);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal__content">
        <h2 className="modal__content-title">Customize Your Meal Plan</h2>

        <h3 className="modal__content-subtitle">Select Cuisines</h3>
        <span className="modal__content-checkbox-group">
          {CUISINE_OPTIONS.map((cuisine) => (
            <label className="modal__content-checkbox-label" key={cuisine}>
              <input
                className="modal__content-checkbox"
                type="checkbox"
                value={cuisine}
                checked={selectedCuisines.includes(cuisine)}
                onChange={(e) =>
                  setSelectedCuisines((prev) =>
                    e.target.checked
                      ? [...prev, cuisine]
                      : prev.filter((c) => c !== cuisine)
                  )
                }
              />
              {cuisine}
            </label>
          ))}
        </span>

        <h3 className="modal__content-subtitle">Select Meal Types</h3>
        <span className="modal__content-checkbox-group">
          {MEAL_TYPE_OPTIONS.map((type) => (
            <label className="modal__content-checkbox-label" key={type}>
              <input
                className="modal__content-checkbox"
                type="checkbox"
                value={type}
                checked={selectedMealTypes.includes(type)}
                onChange={(e) =>
                  setSelectedMealTypes((prev) =>
                    e.target.checked
                      ? [...prev, type]
                      : prev.filter((t) => t !== type)
                  )
                }
              />
              {type}
            </label>
          ))}
        </span>
        <div className="meal-planner__actions">
          <button className="meal-planner__button" onClick={handleSubmit}>
            Generate Meal Plan
          </button>
          <button className="meal-planner__button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default MealPlanModal;
