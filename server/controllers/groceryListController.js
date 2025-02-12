import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getGroceryList = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const groceryItems = await knex("grocery_lists")
      .where("user_id", user_id)
      .select("id", "items as name", "completed", "created_at");

    const mealPlans = await knex("meal_plans")
      .where("user_id", user_id)
      .select("recipe_id");

    const recipeIds = mealPlans.map((mp) => mp.recipe_id);

    let mealPlanIngredients = [];
    if (recipeIds.length) {
      const recipes = await knex("recipes")
        .whereIn("id", recipeIds)
        .select("ingredients");

      recipes.forEach((recipe) => {
        if (recipe.ingredients) {
          const ingredients = recipe.ingredients
            .split(",")
            .map((ing) => ing.trim().toLowerCase());
          mealPlanIngredients.push(...ingredients);
        }
      });
    }

    mealPlanIngredients = [...new Set(mealPlanIngredients)];

    const groceryListWithFlag = groceryItems.map((item) => {
      const itemName = item.name.trim().toLowerCase();
      const isMealPlanItem = mealPlanIngredients.includes(itemName);
      return {
        ...item,
        manual: !isMealPlanItem,
      };
    });

    return res.status(200).json(groceryListWithFlag);
  } catch (error) {
    console.error("Error generating grocery list:", error);
    return res.status(500).json({ error: "Failed to generate grocery list" });
  }
};

export const addItemToGroceryList = async (req, res) => {
  try {
    const { user_id, items, completed = false } = req.body;
    if (!user_id || !items) {
      return res.status(400).json({ error: "User ID and items are required" });
    }

    const normalizedItem = items.trim().toLowerCase();

    const existingItem = await knex("grocery_lists")
      .where("user_id", user_id)
      .andWhere(knex.raw("LOWER(items) = ?", [normalizedItem]))
      .first();

    if (existingItem) {
      return res.status(409).json({ error: "Item already exists" });
    }

    const [id] = await knex("grocery_lists").insert({
      user_id,
      items,
      completed,
    });

    return res.status(201).json({ id, user_id, items, completed });
  } catch (error) {
    console.error("Error adding grocery item:", error);
    return res.status(500).json({ error: "Failed to add item" });
  }
};

export const updateGroceryListItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, completed } = req.body;

    const existingItem = await knex("grocery_lists").where({ id }).first();
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updateData = {};
    if (items) updateData.items = items;
    if (completed !== undefined) updateData.completed = completed;

    await knex("grocery_lists").where({ id }).update(updateData);
    const updatedItem = await knex("grocery_lists").where({ id }).first();
    return res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    return res.status(500).json({ error: "Failed to update item" });
  }
};

export const removeItemFromGroceryList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const deleted = await knex("grocery_lists")
      .where({ id: req.params.id, user_id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Item not found or unauthorized" });
    }

    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    return res.status(500).json({ error: "Failed to delete item" });
  }
};

export const groceryItemComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, user_id } = req.body;

    const updated = await knex("grocery_lists")
      .where({ id, user_id })
      .update({ completed });

    if (!updated) {
      return res.status(404).json({ error: "Item not found or unauthorized" });
    }

    return res.status(200).json({
      message: `Item marked as ${completed ? "complete" : "incomplete"}`,
    });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    return res.status(500).json({ error: "Failed to update grocery item" });
  }
};

export const addMealToPlan = async (req, res) => {
  try {
    const { user_id, recipe_id, meal_type, date } = req.body;
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
      if (!normalizedFridgeItems.includes(ingredient.toLowerCase())) {
        const exists = await knex("grocery_lists")
          .where("user_id", user_id)
          .andWhere(knex.raw("LOWER(items) = ?", [ingredient.toLowerCase()]))
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
