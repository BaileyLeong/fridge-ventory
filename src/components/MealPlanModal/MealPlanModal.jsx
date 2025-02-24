import { useState } from "react";
import { CUISINE_OPTIONS, MEAL_TYPE_OPTIONS } from "../../utils/utils";

const MealPlanModal = ({ isOpen, onClose, onGenerate }) => {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);

  const handleSubmit = () => {
    onGenerate({ cuisines: selectedCuisines, mealTypes: selectedMealTypes });
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <h2>Customize Your Meal Plan</h2>

      <h3>Select Cuisines</h3>
      {CUISINE_OPTIONS.map((cuisine) => (
        <label key={cuisine}>
          <input
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

      <h3>Select Meal Types</h3>
      {MEAL_TYPE_OPTIONS.map((type) => (
        <label key={type}>
          <input
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

      <button onClick={handleSubmit}>Generate Meal Plan</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ) : null;
};

export default MealPlanModal;
