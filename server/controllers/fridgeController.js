import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";

const knex = initKnex(configuration);
const API_KEY = process.env.SPOONACULAR_API_KEY;

export const getAllFridgeItems = async (req, res) => {
  try {
    const user_id = req.user.id;
    const items = await knex("fridge_items")
      .join("ingredients", "fridge_items.ingredient_id", "ingredients.id")
      .where("fridge_items.user_id", user_id)
      .select(
        "fridge_items.id",
        "ingredients.id as ingredient_id",
        "ingredients.name as ingredient_name",
        "fridge_items.quantity",
        "fridge_items.unit",
        "fridge_items.expires_at",
        "fridge_items.image_url"
      );

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching fridge items:", error);
    res.status(500).json({ error: "Failed to fetch fridge items" });
  }
};

export const addFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, quantity, unit, expires_at } = req.body;

    let ingredient = await knex("ingredients").where("name", name).first();

    if (!ingredient) {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${API_KEY}`
      );

      if (response.data.results.length > 0) {
        const foundIngredient = response.data.results[0];

        const [newIngredientId] = await knex("ingredients")
          .insert({
            id: foundIngredient.id,
            name: foundIngredient.name,
          })
          .onConflict("id")
          .ignore();

        ingredient = { id: newIngredientId || foundIngredient.id };
      } else {
        return res.status(400).json({ error: "Ingredient not found" });
      }
    }

    const [id] = await knex("fridge_items").insert({
      user_id,
      ingredient_id: ingredient.id,
      quantity,
      unit,
      expires_at,
    });

    res.status(201).json({
      id,
      user_id,
      ingredient_id: ingredient.id,
      quantity,
      unit,
      expires_at,
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
    const { quantity, unit, expires_at } = req.body;
    const updateData = { quantity, unit, expires_at };

    const updated = await knex("fridge_items")
      .where({ id, user_id })
      .update(updateData);

    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update fridge item" });
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
    res.status(500).json({ error: "Failed to delete fridge item" });
  }
};
