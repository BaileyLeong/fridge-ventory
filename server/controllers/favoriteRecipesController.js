import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getFavoriteRecipes = async (req, res) => {
  try {
    const user_id = req.user.id;

    const favoriteRecipes = await knex("favorite_recipes")
      .join("recipes", "favorite_recipes.recipe_id", "recipes.id")
      .where({ "favorite_recipes.user_id": user_id })
      .select(
        "recipes.id",
        "recipes.name",
        "recipes.category",
        "recipes.image_url",
        "recipes.source_url",
        "recipes.steps",
        "recipes.ready_in_minutes",
        "recipes.servings"
      );

    res.status(200).json(favoriteRecipes);
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await knex("recipes").where({ id }).first();

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

export const addFavoriteRecipe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { recipe_id } = req.body;

    if (!recipe_id) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    const recipeExists = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipeExists) {
      return res.status(404).json({ error: "Recipe not found in system" });
    }

    const existingFavorite = await knex("favorite_recipes")
      .where({ user_id, recipe_id })
      .first();

    if (existingFavorite) {
      return res.status(409).json({ error: "Recipe is already in favorites" });
    }

    await knex("favorite_recipes").insert({ user_id, recipe_id });

    res.status(201).json({ message: "Recipe added to favorites", recipe_id });
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    res.status(500).json({ error: "Failed to add favorite recipe" });
  }
};

export const removeFavoriteRecipe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id: recipe_id } = req.params;

    const deleted = await knex("favorite_recipes")
      .where({ recipe_id, user_id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error("Error deleting favorite recipe:", error);
    res.status(500).json({ error: "Failed to delete favorite recipe" });
  }
};
