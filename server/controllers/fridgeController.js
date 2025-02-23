import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";

const knex = initKnex(configuration);
const PRIMARY_API_KEY = process.env.SPOONACULAR_API_KEY; // General API key
const SECONDARY_API_KEY = process.env.SPOONACULAR_SECONDARY_API_KEY; // Separate key for ingredient details

export const getAllFridgeItems = async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log(`Fetching fridge items for user: ${user_id}`);

    const items = await knex("fridge_items")
      .leftJoin("ingredients", "fridge_items.ingredient_id", "ingredients.id")
      .where("fridge_items.user_id", user_id)
      .select(
        "fridge_items.id",
        "fridge_items.ingredient_id",
        "fridge_items.quantity",
        "fridge_items.unit",
        "fridge_items.expires_at",
        "fridge_items.image_url",
        "ingredients.name as ingredient_name"
      );

    console.log("Fetched fridge items:", items);

    if (!items || items.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching fridge items:", error);
    res.status(500).json({ error: "Failed to fetch fridge items" });
  }
};

export const addFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    let { ingredient_id, name, quantity, unit, expires_at } = req.body;

    expires_at = expires_at || null;
    let ingredient;
    let image_url = null;

    console.log(`Adding item: name=${name}, ingredient_id=${ingredient_id}`);

    // Check if ingredient exists in the database
    if (ingredient_id) {
      ingredient = await knex("ingredients").where("id", ingredient_id).first();
    } else {
      ingredient = await knex("ingredients").where("name", name).first();
    }

    if (!ingredient) {
      console.log(
        `Ingredient not found locally, searching Spoonacular for: ${name}`
      );

      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${PRIMARY_API_KEY}`, // ✅ General API key
          {
            headers: { "x-api-key": PRIMARY_API_KEY }, // ✅ Correct API key for search
          }
        );

        console.log("Spoonacular search response:", response.data);

        if (!response.data.results || response.data.results.length === 0) {
          return res.status(400).json({ error: "Ingredient not found" });
        }

        const foundIngredient = response.data.results[0];
        ingredient_id = foundIngredient.id;
        image_url = foundIngredient.image
          ? `https://img.spoonacular.com/ingredients_500x500/${foundIngredient.image}`
          : "https://placehold.co/500";

        console.log(
          `Found ingredient: ${foundIngredient.name}, ID: ${ingredient_id}, Image: ${image_url}`
        );

        await knex("ingredients")
          .insert({
            id: foundIngredient.id,
            name: foundIngredient.name,
          })
          .onConflict("id")
          .ignore();
      } catch (error) {
        console.error("Error searching Spoonacular for ingredient:", error);
      }
    } else {
      ingredient_id = ingredient.id;
      image_url = ingredient.image_url || null;
      console.log(
        `Ingredient found locally: ${ingredient.name}, ID: ${ingredient_id}, Image: ${image_url}`
      );
    }

    // If no image was found, try fetching from Spoonacular ingredient info endpoint
    if (!image_url) {
      console.log(
        `Fetching detailed information for ingredient ID: ${ingredient_id}`
      );
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/${ingredient_id}/information?apiKey=${INGREDIENTS_API_KEY}`, // ✅ Ingredient API key
          {
            headers: { "x-api-key": SECONDARY_API_KEY }, // ✅ Correct API key for ingredient details
          }
        );

        console.log("Ingredient information response:", response.data);

        image_url = response.data.image
          ? `https://img.spoonacular.com/ingredients_500x500/${response.data.image}`
          : "https://placehold.co/500"; // Default fallback

        console.log(`Fetched image from Spoonacular: ${image_url}`);
      } catch (error) {
        console.error(
          `Error fetching ingredient image for ID ${ingredient_id}:`,
          error
        );
        image_url = "https://placehold.co/500"; // Fallback if request fails
      }
    }

    console.log(
      `Final image URL for ingredient ID ${ingredient_id}: ${image_url}`
    );

    // Insert fridge item into the database
    const [id] = await knex("fridge_items").insert({
      user_id,
      ingredient_id,
      quantity,
      unit: unit || null,
      expires_at,
      image_url,
    });

    console.log(`Fridge item added successfully with ID ${id}`);

    // Return the newly created fridge item
    res.status(201).json({
      id,
      user_id,
      ingredient_id,
      ingredient_name: ingredient?.name || name,
      quantity,
      unit,
      expires_at,
      image_url,
    });
  } catch (error) {
    console.error("Error adding fridge item:", error);
    res.status(500).json({ error: "Failed to add fridge item" });
  }
};

export const updateFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { quantity, expires_at } = req.body;

    if (quantity === undefined && expires_at === undefined) {
      return res.status(400).json({ error: "No update values provided." });
    }

    if (expires_at && isNaN(Date.parse(expires_at))) {
      return res.status(400).json({ error: "Invalid expiration date format." });
    }

    let updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    const updated = await knex("fridge_items")
      .where({ id, user_id })
      .update(updateData);

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Fridge item not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Fridge item updated successfully",
      id,
      updated_fields: updateData,
    });
  } catch (error) {
    console.error("Error updating fridge item:", error);
    return res.status(500).json({ error: "Failed to update fridge item." });
  }
};

export const deleteFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const deleted = await knex("fridge_items").where({ id, user_id }).del();

    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting fridge item:", error);
    res.status(500).json({ error: "Failed to delete fridge item" });
  }
};

export const moveGroceryToFridge = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const groceryItem = await knex("grocery_lists")
      .where({ id, user_id, completed: true })
      .first();

    if (!groceryItem) {
      return res
        .status(400)
        .json({ error: "Item not found or not marked as complete." });
    }

    const existingFridgeItem = await knex("fridge_items")
      .where({ user_id, ingredient_id: groceryItem.ingredient_id })
      .first();

    if (existingFridgeItem) {
      await knex("fridge_items")
        .where({ user_id, ingredient_id: groceryItem.ingredient_id })
        .increment("quantity", groceryItem.quantity);
    } else {
      await knex("fridge_items").insert({
        user_id,
        ingredient_id: groceryItem.ingredient_id,
        quantity: groceryItem.quantity,
        unit: groceryItem.unit || null,
        expires_at: null,
      });
    }

    await knex("grocery_lists").where({ id, user_id }).del();

    return res.status(200).json({
      message: "Item moved to fridge successfully",
      ingredient_id: groceryItem.ingredient_id,
      added_quantity: groceryItem.quantity,
    });
  } catch (error) {
    console.error("Error moving item to fridge:", error);
    return res.status(500).json({ error: "Failed to move item to fridge" });
  }
};

export const useMealIngredients = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const meal = await knex("meal_plans").where({ id, user_id }).first();

    if (!meal) {
      return res.status(404).json({ error: "Meal not found or unauthorized." });
    }

    const recipeIngredients = await knex("recipe_ingredients")
      .where({ recipe_id: meal.recipe_id })
      .select("ingredient_id", "amount_metric", "unit_metric");

    if (recipeIngredients.length === 0) {
      return res
        .status(400)
        .json({ error: "No ingredients found for this recipe." });
    }

    const fridgeItems = await knex("fridge_items")
      .where({ user_id })
      .select("ingredient_id", "quantity");

    let deductions = [];
    for (const ingredient of recipeIngredients) {
      const fridgeItem = fridgeItems.find(
        (item) => item.ingredient_id === ingredient.ingredient_id
      );

      if (fridgeItem) {
        const newQuantity = fridgeItem.quantity - ingredient.amount_metric;

        if (newQuantity > 0) {
          await knex("fridge_items")
            .where({ user_id, ingredient_id: ingredient.ingredient_id })
            .update({ quantity: newQuantity });

          deductions.push({
            ingredient_id: ingredient.ingredient_id,
            deducted: ingredient.amount_metric,
          });
        } else {
          await knex("fridge_items")
            .where({ user_id, ingredient_id: ingredient.ingredient_id })
            .del();

          deductions.push({
            ingredient_id: ingredient.ingredient_id,
            deducted: fridgeItem.quantity,
            removed: true,
          });
        }
      }
    }

    await knex("meal_plans").where({ id, user_id }).del();

    return res.status(200).json({
      message: "Ingredients deducted from fridge.",
      meal_id: id,
      deductions,
    });
  } catch (error) {
    console.error("Error using meal ingredients:", error);
    return res.status(500).json({ error: "Failed to use meal ingredients." });
  }
};
