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
import { formatDateForDisplay } from "../../utils/utils.js";

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
      return date.toLocaleDateString("en-US");
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

    let selectedDate =
      selectedDates[selectedRecipe.id] ||
      new Date().toISOString().split("T")[0];

    const localDate = new Date(selectedDate);
    const utcDate = new Date(
      localDate.getTime() + localDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

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
        date: utcDate,
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
        const payload = {
          name: ingredient.name,
          quantity: ingredient.amount,
          unit: ingredient.unit,
          completed: false,
        };
        console.log("Adding ingredient with payload:", payload);
        addGroceryItem(payload);
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
    <div className="surprise">
      <h1 className="surprise__title">Surprise Me!</h1>

      {selectedRecipe ? (
        <div className="surprise__card">
          <img
            className="surprise__image"
            src={selectedRecipe.image || "https://via.placeholder.com/150"}
            alt={selectedRecipe.title}
          />
          <div className="surprise__content">
            <h2 className="surprise__recipe-title">{selectedRecipe.title}</h2>
            <p className="surprise__likes">
              ❤️ Likes: {selectedRecipe.likes || 0}
            </p>
            <h3 className="surprise__subheading">Used Ingredients:</h3>
            <ul className="surprise__ingredient-list">
              {selectedRecipe.usedIngredients?.map((ingredient) => {
                const imageUrl = ingredient.image
                  ? ingredient.image.startsWith("http")
                    ? ingredient.image
                    : `${BASE_IMAGE_URL}${ingredient.image}`
                  : null;
                return (
                  <li key={ingredient.id} className="surprise__ingredient">
                    {imageUrl && (
                      <img
                        className="surprise__ingredient-image"
                        src={imageUrl}
                        alt={ingredient.name}
                      />
                    )}
                    <p className="surprise__ingredient-text">
                      {ingredient.original} ({ingredient.amount}{" "}
                      {ingredient.unit})
                    </p>
                  </li>
                );
              })}
            </ul>
            <h3 className="surprise__subheading">Missed Ingredients:</h3>
            <ul className="surprise__ingredient-list">
              {selectedRecipe.missedIngredients?.length > 0 ? (
                selectedRecipe.missedIngredients.map((ingredient) => (
                  <li key={ingredient.id} className="surprise__ingredient">
                    <img
                      className="surprise__ingredient-image"
                      src={ingredient.image}
                      alt={ingredient.name}
                    />
                    <p className="surprise__ingredient-text">
                      {ingredient.original}
                    </p>
                  </li>
                ))
              ) : (
                <p className="surprise__message">
                  No missed ingredients found.
                </p>
              )}
            </ul>
            <div className="surprise__date">
              <label className="surprise__label">Select a date:</label>
              <select
                className="surprise__select"
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
            </div>
          </div>
          <div className="surprise__buttons">
            <button
              className="surprise__button surprise__button--add"
              onClick={handleAddToMealPlan}
            >
              Add to Meal Plan
            </button>
            <button
              className="surprise__button surprise__button--skip"
              onClick={handleSkipRecipe}
            >
              Skip
            </button>
          </div>
        </div>
      ) : (
        <p className="surprise__message">
          Loading recipes or no recipes found...
        </p>
      )}
    </div>
  );
};

export default SurpriseMe;
