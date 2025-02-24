import { useEffect, useState } from "react";
import { useIsMobile } from "../../utils/hooks.js";
import MealCard from "../../components/MealCard/MealCard.jsx";
import MealListMobile from "../../components/MealListMobile/MealListMobile.jsx";
import MealPlanModal from "../../components/MealPlanModal/MealPlanModal.jsx";
import {
  fetchMealPlan,
  updateMealInPlan,
  deleteMealFromPlan,
  fetchRecipes,
  fetchFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  generateMealPlan,
} from "../../api/apiClient";
import "./MealPlanner.scss";

const isSameWeek = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.abs((date1 - date2) / oneDay);
  return diffDays < 7 && date1.getDay() >= date2.getDay();
};

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    const today = new Date();
    const todayDay = today.getDay();
    const lastShown = localStorage.getItem("lastModalShown");

    if (todayDay === 5) {
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
        const sortedMeals = response.data.sort(
          (a, b) => new Date(a.meal_date) - new Date(b.meal_date)
        );
        setMealPlan(sortedMeals);

        const initialDates = sortedMeals.reduce((acc, meal) => {
          acc[meal.id] = meal.meal_date;
          return acc;
        }, {});
        setSelectedDates(initialDates);
      })
      .catch((error) => console.error("Error fetching meal plan:", error));

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

  const handleGenerateMealPlan = (preferences) => {
    generateMealPlan(preferences)
      .then((response) => {
        setMealPlan(response.data);
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error generating meal plan:", error));
  };

  const handleUpdateMealDate = (id, newDate, recipeId, mealType) => {
    const localDate = new Date(newDate);
    const utcDate = new Date(
      localDate.getTime() + localDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    updateMealInPlan(id, {
      recipe_id: recipeId,
      meal_type: mealType,
      date: utcDate,
    })
      .then(() => {
        setSelectedDates((prev) => ({ ...prev, [id]: newDate }));
        return fetchMealPlan();
      })
      .then((response) => setMealPlan(response.data))
      .catch((error) => console.error("Error updating meal date:", error));
  };

  const handleDeleteMeal = (id) => {
    deleteMealFromPlan(id)
      .then(() =>
        fetchMealPlan().then((response) => setMealPlan(response.data))
      )
      .catch((error) => console.error("Error deleting meal:", error));
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

  const groupedMeals = mealPlan.reduce((groups, meal) => {
    const dateKey = selectedDates[meal.id] || meal.meal_date;
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
