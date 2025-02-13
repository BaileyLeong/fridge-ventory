import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);

const API_KEY = process.env.SPOONACULAR_API_KEY;

export const getFavoriteRecipes = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch list of favorite recipe IDs
    const favoriteList = await knex("favorite_recipes")
      .where({ user_id })
      .select("recipe_id");

    if (favoriteList.length === 0) {
      return res.status(200).json([]); // Return an empty array if no favorites
    }

    console.log("Favorite Recipe IDs:", favoriteList); // Debugging Log

    // Make API requests to fetch full details
    const recipeRequests = favoriteList.map((fav) =>
      axios
        .get(
          `https://api.spoonacular.com/recipes/${fav.recipe_id}/information?apiKey=${API_KEY}`
        )
        .catch((error) => {
          console.error(
            `Error fetching recipe ${fav.recipe_id}:`,
            error.message
          );
          return null; // Prevent Promise.all from failing
        })
    );

    const recipeResponses = await Promise.all(recipeRequests);

    // Filter out any failed requests
    const fullRecipes = recipeResponses
      .filter((response) => response && response.data)
      .map((response) => response.data);

    if (fullRecipes.length === 0) {
      return res.status(500).json({ error: "All Spoonacular requests failed" });
    }

    res.status(200).json(fullRecipes);
  } catch (error) {
    console.error("Unexpected error fetching favorite recipes:", error);
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
