import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);

export const getAllFridgeItems = async (req, res) => {
  try {
    const user_id = req.user.id;
    const items = await knex("fridge_items").where({ user_id }).select("*");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fridge items" });
  }
};

export const getFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const item = await knex("fridge_items").where({ id, user_id }).first();
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fridge item" });
  }
};

const API_KEY = process.env.SPOONACULAR_API_KEY;

export const addFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, quantity, unit, expires_at } = req.body;

    const response = await axios.get(
      `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${API_KEY}`
    );

    let image_url = "https://placehold.co/100";
    if (response.data.results.length > 0) {
      image_url = `https://spoonacular.com/cdn/ingredients_100x100/${response.data.results[0].image}`;
    }

    const [id] = await knex("fridge_items").insert({
      user_id,
      name,
      quantity,
      unit,
      expires_at,
      image_url,
    });

    res
      .status(201)
      .json({ id, user_id, name, quantity, unit, expires_at, image_url });
  } catch (error) {
    console.error("Error adding fridge item:", error);
    res.status(500).json({ error: "Failed to add fridge item" });
  }
};

export const updateFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const updated = await knex("fridge_items")
      .where({ id, user_id })
      .update(req.body);
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
