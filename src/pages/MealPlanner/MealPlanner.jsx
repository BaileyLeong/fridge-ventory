import { useEffect, useState } from "react";
import { useIsMobile } from "../../utils/hooks.js";
import MealCard from "../../components/MealCard/MealCard.jsx";
import MealListMobile from "../../components/MealListMobile/MealListMobile.jsx";
import MealPlanModal from "../../components/MealPlanModal/MealPlanModal.jsx";
import {
  fetchMealPlan,
  updateMealInPlan,
  addMealToPlan,
  deleteMealFromPlan,
  fetchRecipes,
  fetchFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  generateMealPlan,
} from "../../api/apiClient";
import "../MealPlanner/MealPlanner.scss";
import MealSelectionList from "../../components/MealSelectionList/MealSelectionList.jsx";

const isSameWeek = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.abs((date1 - date2) / oneDay);
  return diffDays < 7 && date1.getDay() >= date2.getDay();
};

const toUTCDateString = (dateString) => {
  const localDate = new Date(dateString);
  if (isNaN(localDate.getTime())) {
    console.error("Invalid date string:", dateString);
    return "";
  }
  return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [generatedMeals, setGeneratedMeals] = useState([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    const today = new Date();
    const todayDay = today.getDay();
    const lastShown = localStorage.getItem("lastModalShown");

    if (todayDay === 1) {
      const lastShownDate = lastShown ? new Date(lastShown) : null;

      if (!lastShownDate || !isSameWeek(today, lastShownDate)) {
        setIsModalOpen(true);
        localStorage.setItem("lastModalShown", today.toISOString());
      }
    }
  }, []);

  useEffect(() => {
    fetchMealPlan()
      .then((response) => {
        const sortedMeals = Array.isArray(response.data)
          ? response.data.sort(
              (a, b) => new Date(a.meal_date) - new Date(b.meal_date)
            )
          : [];
        setMealPlan(sortedMeals);

        const initialDates = sortedMeals.reduce((acc, meal) => {
          acc[meal.id] = meal.meal_date;
          return acc;
        }, {});
        setSelectedDates(initialDates);
      })
      .catch((error) => {
        console.error("Error fetching meal plan:", error);
        setMealPlan([]);
      });

    fetchRecipes()
      .then((response) => setAvailableRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));

    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toLocaleDateString("en-US");
    });
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    fetchFavoriteRecipes()
      .then((response) => {
        setFavorites(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      });
  }, []);

  const handleGenerateMealPlan = async (preferences) => {
    try {
      const response = await generateMealPlan(preferences);

      const { data } = response;
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Error: Received empty meal plan response");
        setGeneratedMeals([]);
        return;
      }
      setGeneratedMeals(data);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setGeneratedMeals([]);
    }
  };

  const handleSaveMealPlan = async (mealsWithDates) => {
    try {
      for (const meal of mealsWithDates) {
        const mealDate = toUTCDateString(meal.meal_date);
        if (!mealDate) {
          console.error("Invalid date for meal:", meal);
          continue;
        }

        await addMealToPlan({
          recipe_id: meal.recipe_id,
          meal_type: meal.meal_type,
          source_url: meal.source_url,
          date: mealDate,
        });
      }

      const updatedMealPlan = await fetchMealPlan();
      setMealPlan(updatedMealPlan.data);
      setGeneratedMeals([]);
    } catch (error) {
      console.error("Error saving meal plan:", error);
      setError(
        "Invalid date for one or more meals. Please check the dates and try again."
      );
    }
  };

  const handleUpdateMealDate = async (id, newDate, recipeId, mealType) => {
    try {
      const utcDate = toUTCDateString(newDate);
      if (!utcDate) {
        console.error("Invalid date for update:", newDate);
        return;
      }

      await updateMealInPlan(id, {
        recipe_id: recipeId,
        meal_type: mealType,
        date: utcDate,
      });

      setSelectedDates((prev) => ({ ...prev, [id]: utcDate }));

      const updatedMealPlan = await fetchMealPlan();
      setMealPlan(updatedMealPlan.data);
    } catch (error) {
      console.error("Error updating meal date:", error);
      setError("Failed to save the meal plan. Please try again.");
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMealFromPlan(id);

      const updatedMealPlan = await fetchMealPlan();
      setMealPlan(updatedMealPlan.data);
    } catch (error) {
      console.error("Error deleting meal:", error);
      setError("Failed to delete the meal. Please try again.");
    }
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      const latestFavorites = await fetchFavoriteRecipes().then(
        (res) => res.data || []
      );

      if (!Array.isArray(latestFavorites)) {
        console.error(
          "Error: Fetched favorites is not an array",
          latestFavorites
        );
        return;
      }

      const isFavorited = latestFavorites.some((fav) => fav.id === recipeId);

      if (isFavorited) {
        await removeFavoriteRecipe(recipeId);

        setFavorites((prevFavorites) => {
          const updatedFavorites = prevFavorites.filter(
            (fav) => fav.id !== recipeId
          );
          return updatedFavorites;
        });
      } else {
        await addFavoriteRecipe(recipeId);

        setFavorites((prevFavorites) => {
          const updatedFavorites = [...prevFavorites, { id: recipeId }];
          return updatedFavorites;
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const safeMealPlan = Array.isArray(mealPlan) ? mealPlan : [];

  const groupedMeals = safeMealPlan.reduce((groups, meal) => {
    const dateKey = selectedDates[meal.id]
      ? toUTCDateString(selectedDates[meal.id])
      : toUTCDateString(meal.meal_date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meal);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMeals).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <section className="meal-planner__container">
      <h1 className="meal-planner__title">Meal Planner</h1>

      <MealPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerateMealPlan}
      />
      {generatedMeals.length > 0 && (
        <MealSelectionList
          generatedMeals={generatedMeals}
          availableDates={availableDates}
          onSave={handleSaveMealPlan}
        />
      )}

      <div className="meal-planner">
        {sortedDates.map((date) => {
          const mealsForDate = groupedMeals[date];
          const remainder = mealsForDate.length % 3;
          const spacersNeeded = remainder ? 3 - remainder : 0;
          return (
            <div key={date} className="meal-planner__group">
              <h2 className="meal-planner__group-title">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </h2>
              <ul className="meal-planner__list">
                {mealsForDate.map((meal) =>
                  isMobile ? (
                    <MealListMobile
                      key={meal.id}
                      meal={meal}
                      favorites={favorites}
                      selectedDate={selectedDates[meal.id]}
                      availableDates={availableDates}
                      onUpdateMealDate={handleUpdateMealDate}
                      onDeleteMeal={handleDeleteMeal}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ) : (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      favorites={favorites}
                      selectedDate={selectedDates[meal.id]}
                      availableDates={availableDates}
                      onUpdateMealDate={handleUpdateMealDate}
                      onDeleteMeal={handleDeleteMeal}
                      onToggleFavorite={handleToggleFavorite}
                      className="meal-planner__list-item"
                    />
                  )
                )}
                {Array.from({ length: spacersNeeded }).map((_, index) => (
                  <li
                    key={`spacer-${index}`}
                    className="meal-planner__spacer"
                  ></li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MealPlanner;
