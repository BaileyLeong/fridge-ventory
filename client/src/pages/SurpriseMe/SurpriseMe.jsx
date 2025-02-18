import { useEffect, useState } from "react";
import {
  suggestRecipes,
  fetchRecipes,
  fetchMealPlan,
  fetchGroceryList,
  addRecipe,
  addMealToPlan,
  addGroceryItem,
} from "../../api/apiClient";
import "./SurpriseMe.scss";
import formatDateForDisplay from "../../utils/utils.js";

const SurpriseMe = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [groceryList, setGroceryList] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

  const BASE_IMAGE_URL = "https://img.spoonacular.com/ingredients_100x100/";

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

    suggestRecipes()
      .then((response) => setRecipes(response.data || []))
      .catch((error) =>
        console.error("Error fetching suggested recipes:", error)
      );

    fetchGroceryList()
      .then((response) => setGroceryList(response.data || []))
      .catch((error) => console.error("Error fetching grocery list:", error));

    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    setAvailableDates(dates);
  }, []);

  const handleAddToMealPlan = async () => {
    if (!recipes.length) {
      console.error("No recipes available");
      return;
    }
    const selectedRecipe = recipes[currentRecipeIndex];
    if (!selectedRecipe) {
      console.error("Selected recipe is undefined");
      return;
    }

    const selectedDate =
      selectedDates[selectedRecipe.id] ||
      new Date().toISOString().split("T")[0];

    const mealExists = mealPlan.some(
      (meal) => meal.meal_date === selectedDate && meal.meal_type === "Dinner"
    );

    if (mealExists) {
      alert(`You already have a Dinner planned for ${selectedDate}!`);
      return;
    }

    try {
      const response = await fetchRecipes();
      const allRecipes = response.data || [];
      const existingRecipe = allRecipes.find((r) => r.id === selectedRecipe.id);

      if (!existingRecipe) {
        await addRecipe({
          id: selectedRecipe.id,
          name: selectedRecipe.title,
          category: selectedRecipe.dishTypes?.[0] || "Uncategorized",
          image_url: selectedRecipe.image || "https://via.placeholder.com/150",
          source_url: selectedRecipe.sourceUrl || "https://spoonacular.com",
          steps: selectedRecipe.instructions || "No steps provided.",
          ready_in_minutes: selectedRecipe.readyInMinutes || 30,
          servings: selectedRecipe.servings || 2,
        });
      }

      await addMealToPlan({
        recipe_id: selectedRecipe.id,
        meal_type: "Dinner",
        date: selectedDate,
      });

      const recipeIngredients = [
        ...(selectedRecipe.usedIngredients || []),
        ...(selectedRecipe.missedIngredients || []),
      ];
      if (!Array.isArray(recipeIngredients)) {
        console.error("Error: No valid ingredients found for this recipe.");
        return;
      }
      recipeIngredients.forEach((ingredient) => {
        addGroceryItem({
          name: ingredient.name,
          quantity: ingredient.amount_metric || ingredient.amount_us || 1,
          unit: ingredient.unit_metric || ingredient.unit_us || null,
          completed: false,
        });
      });

      setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
    } catch (error) {
      console.error(
        "Error adding meal:",
        error.response?.data || error.message
      );
    }
  };

  const handleSkipRecipe = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const selectedRecipe = recipes[currentRecipeIndex];

  return (
    <div>
      <h1>Surprise Me!</h1>
      {selectedRecipe ? (
        <div>
          <h2>{selectedRecipe.title}</h2>
          <img
            src={selectedRecipe.image || "https://via.placeholder.com/150"}
            alt={selectedRecipe.title}
          />
          <p>Likes: {selectedRecipe.likes || 0}</p>
          <h3>Used Ingredients:</h3>
          <ul>
            {selectedRecipe.usedIngredients &&
              selectedRecipe.usedIngredients.map((ingredient) => {
                const imageUrl = ingredient.image
                  ? ingredient.image.startsWith("http")
                    ? ingredient.image
                    : `${BASE_IMAGE_URL}${ingredient.image}`
                  : null;

                return (
                  <li key={ingredient.id}>
                    {imageUrl && <img src={imageUrl} alt={ingredient.name} />}
                    <p>
                      {ingredient.original} ({ingredient.amount}{" "}
                      {ingredient.unit})
                    </p>
                  </li>
                );
              })}
          </ul>

          <h3>Missed Ingredients:</h3>
          <ul>
            {selectedRecipe.missedIngredients?.length > 0 ? (
              selectedRecipe.missedIngredients.map((ingredient) => (
                <li key={ingredient.id}>
                  <img src={ingredient.image} alt={ingredient.name} />
                  {ingredient.original}
                </li>
              ))
            ) : (
              <p>No missed ingredients found.</p>
            )}
          </ul>
          <label>Select a date:</label>
          <select
            value={
              selectedDates[selectedRecipe.id] ||
              new Date().toISOString().split("T")[0]
            }
            onChange={(e) =>
              setSelectedDates({
                ...selectedDates,
                [selectedRecipe.id]: e.target.value,
              })
            }
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDateForDisplay(date)}
              </option>
            ))}
          </select>

          <button onClick={handleAddToMealPlan}>Add to Meal Plan</button>
          <button onClick={handleSkipRecipe}>Skip</button>
        </div>
      ) : (
        <p>Loading recipes or no recipes found...</p>
      )}
    </div>
  );
};

export default SurpriseMe;
