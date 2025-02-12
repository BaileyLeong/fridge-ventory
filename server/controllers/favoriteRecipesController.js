import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getFavoriteRecipes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const favorites = await knex("favorite_recipes")
      .where({ user_id })
      .select("*");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
};

export const addFavoriteRecipe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const newFavorite = { ...req.body, user_id };
    const [id] = await knex("favorite_recipes").insert(newFavorite);
    res.status(201).json({ id, ...newFavorite });
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite recipe" });
  }
};

export const removeFavoriteRecipe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const deleted = await knex("favorite_recipes").where({ id, user_id }).del();
    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete favorite recipe" });
  }
};
