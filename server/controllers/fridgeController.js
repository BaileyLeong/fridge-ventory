import initKnex from "knex";
import configuration from "../knexfile.js";
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

export const addFridgeItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const newItem = { ...req.body, user_id };
    const [id] = await knex("fridge_items").insert(newItem);
    res.status(201).json({ id, ...newItem });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add fridge item",
      details: error.message,
    });
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
