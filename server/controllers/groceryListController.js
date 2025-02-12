import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getGroceryList = async (req, res) => {
  try {
    const user_id = req.user.id;
    const groceryItems = await knex("grocery_lists")
      .where({ user_id })
      .select("id", "items as name", "completed", "created_at");

    const mealPlans = await knex("meal_plans")
      .where({ user_id })
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
      return { ...item, manual: !isMealPlanItem };
    });
    return res.status(200).json(groceryListWithFlag);
  } catch (error) {
    console.error("Error generating grocery list:", error);
    return res.status(500).json({ error: "Failed to generate grocery list" });
  }
};

export const addItemToGroceryList = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { items, completed = false } = req.body;
    if (!items) {
      return res.status(400).json({ error: "Items field is required" });
    }
    const normalizedItem = items.trim().toLowerCase();
    const existingItem = await knex("grocery_lists")
      .where({ user_id })
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
    const user_id = req.user.id;
    const { id } = req.params;
    const { items, completed } = req.body;
    const existingItem = await knex("grocery_lists")
      .where({ id, user_id })
      .first();
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    const updateData = {};
    if (items) updateData.items = items;
    if (completed !== undefined) updateData.completed = completed;
    await knex("grocery_lists").where({ id, user_id }).update(updateData);
    const updatedItem = await knex("grocery_lists")
      .where({ id, user_id })
      .first();
    return res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    return res.status(500).json({ error: "Failed to update item" });
  }
};

export const removeItemFromGroceryList = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const deleted = await knex("grocery_lists").where({ id, user_id }).del();
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
    const user_id = req.user.id;
    const { id } = req.params;
    const { completed } = req.body;
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
