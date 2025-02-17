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
      .select("ingredient_id");

    const fridgeItems = await knex("fridge_items")
      .where({ user_id })
      .pluck("ingredient_id");

    const groceryItemsToInsert = requiredIngredients
      .filter((ingredient) => !fridgeItems.includes(ingredient.ingredient_id))
      .map((ingredient) => ({
        user_id,
        ingredient_id: ingredient.ingredient_id,
        completed: false,
      }));

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

    return res.status(200).json({
      message: "Meal updated successfully",
      id,
      user_id,
      recipe_id,
      meal_type,
      meal_date: mealDate,
    });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    return res.status(500).json({ error: "Failed to update meal date" });
  }
};
