import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getMealPlan = async (req, res) => {
  try {
    const user_id = req.user.id;

    const plan = await knex("meal_plans")
      .join("recipes", "meal_plans.recipe_id", "recipes.id")
      .where("meal_plans.user_id", user_id)
      .select(
        "meal_plans.id",
        "meal_plans.meal_date",
        "meal_plans.meal_type",
        "recipes.id as recipe_id",
        "recipes.name",
        "recipes.image_url",
        "recipes.steps"
      );

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
};

export const addMealToPlan = async (req, res) => {
  try {
    const { recipe_id, meal_type, date } = req.body;
    const user_id = req.user.id;

    if (!user_id || !recipe_id || !meal_type) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const mealDate =
      date && date.trim() !== ""
        ? date
        : new Date().toISOString().split("T")[0];

    const recipe = await knex("recipes").where("id", recipe_id).first();
    if (!recipe) {
      return res
        .status(400)
        .json({ error: "Recipe does not exist in the database." });
    }

    const [id] = await knex("meal_plans").insert({
      user_id,
      recipe_id,
      meal_type,
      meal_date: mealDate,
    });

    const requiredIngredients = await knex("recipe_ingredients")
      .where("recipe_id", recipe_id)
      .select("ingredient_id", "amount_metric", "unit_metric");

    let groceryItemsAdded = 0;
    for (const ingredient of requiredIngredients) {
      const existingGroceryItem = await knex("grocery_lists")
        .where({ user_id, ingredient_id: ingredient.ingredient_id })
        .first();

      if (existingGroceryItem) {
        await knex("grocery_lists")
          .where({ user_id, ingredient_id: ingredient.ingredient_id })
          .increment("quantity", ingredient.amount_metric || 1);
      } else {
        await knex("grocery_lists").insert({
          user_id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.amount_metric || 1,
          unit: ingredient.unit || null,
          completed: false,
        });
        groceryItemsAdded++;
      }
    }

    return res.status(201).json({
      id,
      user_id,
      recipe_id,
      meal_type,
      date: mealDate,
      groceryItemsAdded,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Failed to add meal" });
  }
};

export const updateMealInPlan = async (req, res) => {
  try {
    const { recipe_id, meal_type, date } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const existingMeal = await knex("meal_plans")
      .where({ id, user_id })
      .first();
    if (!existingMeal) {
      return res.status(404).json({ error: "Meal not found or unauthorized" });
    }

    const mealDate =
      date && date.trim() !== ""
        ? date
        : new Date().toISOString().split("T")[0];

    const updated = await knex("meal_plans").where({ id, user_id }).update({
      recipe_id,
      meal_type,
      meal_date: mealDate,
    });

    if (!updated) {
      return res.status(500).json({ error: "Failed to update meal" });
    }

    const newRequiredIngredients = await knex("recipe_ingredients")
      .where("recipe_id", recipe_id)
      .select("ingredient_id", "amount_metric", "unit_metric");

    const oldRequiredIngredients = await knex("recipe_ingredients")
      .where("recipe_id", existingMeal.recipe_id)
      .pluck("ingredient_id");

    const existingGroceryItems = await knex("grocery_lists")
      .where({ user_id })
      .pluck("ingredient_id");

    const ingredientsToRemove = oldRequiredIngredients.filter(
      (ingredient_id) =>
        !newRequiredIngredients.some(
          (ing) => ing.ingredient_id === ingredient_id
        )
    );

    if (ingredientsToRemove.length > 0) {
      await knex("grocery_lists")
        .where({ user_id })
        .whereIn("ingredient_id", ingredientsToRemove)
        .del();
    }

    let groceryItemsAdded = 0;
    for (const ingredient of newRequiredIngredients) {
      const existingGroceryItem = await knex("grocery_lists")
        .where({ user_id, ingredient_id: ingredient.ingredient_id })
        .first();

      if (existingGroceryItem) {
        await knex("grocery_lists")
          .where({ user_id, ingredient_id: ingredient.ingredient_id })
          .increment("quantity", ingredient.amount_metric || 1);
      } else {
        await knex("grocery_lists").insert({
          user_id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.amount_metric || 1,
          unit: ingredient.unit_metric || null,
          completed: false,
        });
        groceryItemsAdded++;
      }
    }

    return res.status(200).json({
      message: "Meal updated successfully",
      id,
      user_id,
      recipe_id,
      meal_type,
      meal_date: mealDate,
      groceryItemsAdded,
      groceryItemsRemoved: ingredientsToRemove.length,
    });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    return res.status(500).json({ error: "Failed to update meal plan" });
  }
};

export const deleteMealFromPlan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const deleted = await knex("meal_plans").where({ id, user_id }).del();

    if (!deleted) {
      return res.status(404).json({ error: "Meal plan not found" });
    }

    res.status(200).json({ message: "Meal removed from plan" });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    res.status(500).json({ error: "Failed to delete meal plan" });
  }
};
