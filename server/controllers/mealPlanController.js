import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getMealPlan = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

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
        "recipes.ingredients",
        "recipes.steps"
      );

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
};

export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await knex("meal_plans")
      .join("recipes", "meal_plans.recipe_id", "recipes.id")
      .select(
        "meal_plans.id",
        "meal_plans.user_id",
        "meal_plans.meal_date",
        "recipes.id as recipe_id",
        "recipes.name",
        "recipes.image_url",
        "recipes.ingredients",
        "recipes.steps"
      )
      .where("meal_plans.id", id)
      .first();

    if (!meal) return res.status(404).json({ error: "Meal not found" });

    res.status(200).json(meal);
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    res.status(500).json({ error: "Failed to fetch meal" });
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

    const [id] = await knex("meal_plans").insert({
      user_id,
      recipe_id,
      meal_type,
      meal_date: mealDate,
    });

    const recipe = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipe || !recipe.ingredients) {
      return res
        .status(404)
        .json({ error: "Recipe not found or has no ingredients" });
    }

    const ingredientsList = recipe.ingredients
      .split(",")
      .map((item) => item.trim());

    const fridgeItems = await knex("fridge_items")
      .where({ user_id })
      .pluck("name");
    const normalizedFridgeItems = fridgeItems.map((name) =>
      name.trim().toLowerCase()
    );

    const groceryItemsToInsert = [];
    for (const ingredient of ingredientsList) {
      const normalizedIngredient = ingredient.toLowerCase();

      if (!normalizedFridgeItems.includes(normalizedIngredient)) {
        const exists = await knex("grocery_lists")
          .where({ user_id })
          .andWhere(knex.raw("LOWER(items) = ?", [normalizedIngredient]))
          .first();
        if (!exists) {
          groceryItemsToInsert.push({
            user_id,
            items: ingredient,
            completed: false,
          });
        }
      }
    }

    if (groceryItemsToInsert.length > 0) {
      await knex("grocery_lists").insert(groceryItemsToInsert);
    }

    return res.status(201).json({
      id,
      user_id,
      recipe_id,
      meal_type,
      date: mealDate,
      groceryItemsAdded: groceryItemsToInsert.length,
    });
  } catch (error) {
    console.error("Error adding meal to plan:", error);
    return res.status(500).json({ error: "Failed to add meal" });
  }
};

export const updateMealInPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const mealDate =
      date && date.trim() !== ""
        ? date
        : new Date().toISOString().split("T")[0];

    const updated = await knex("meal_plans")
      .where({ id, user_id })
      .update({ meal_date: mealDate });

    if (!updated)
      return res.status(404).json({ error: "Meal not found or unauthorized" });

    res.status(200).json({
      message: "Meal date updated successfully",
      id,
      meal_date: mealDate,
    });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: "Failed to update meal date" });
  }
};

export const deleteMealFromPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const deleted = await knex("meal_plans").where({ id, user_id }).del();

    if (!deleted)
      return res.status(404).json({ error: "Meal not found or unauthorized" });

    res.status(200).json({ message: "Meal removed successfully", id });
  } catch (error) {
    console.error("Error deleting meal from plan:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
};
