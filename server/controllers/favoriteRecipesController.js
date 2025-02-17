import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);
const API_KEY = process.env.SPOONACULAR_API_KEY;

export const getFavoriteRecipes = async (req, res) => {
  try {
    const user_id = req.user.id;

    const favoriteList = await knex("favorite_recipes")
      .where({ user_id })
      .pluck("recipe_id");

    if (favoriteList.length === 0) {
      return res.status(200).json([]);
    }

    const storedRecipes = await knex("recipes").whereIn("id", favoriteList);
    const storedRecipeIds = storedRecipes.map((recipe) => recipe.id);

    const missingRecipeIds = favoriteList.filter(
      (id) => !storedRecipeIds.includes(id)
    );

    let spoonacularRecipes = [];
    if (missingRecipeIds.length > 0) {
      const recipeRequests = missingRecipeIds.map((recipe_id) =>
        axios.get(
          `https://api.spoonacular.com/recipes/${recipe_id}/information?apiKey=${API_KEY}`
        )
      );

      const recipeResponses = await Promise.allSettled(recipeRequests);
      spoonacularRecipes = recipeResponses
        .filter((res) => res.status === "fulfilled" && res.value.data)
        .map((res) => res.value.data);
    }

    const allRecipes = [...storedRecipes, ...spoonacularRecipes];
    res.status(200).json(allRecipes);
  } catch (error) {
    console.error("Unexpected error fetching favorite recipes:", error);
    res.status(500).json({ error: "Failed to fetch favorite recipes" });
  }
};

export const addFavoriteRecipe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { recipe_id } = req.body;

    if (!recipe_id) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    let recipe = await knex("recipes").where({ id: recipe_id }).first();

    if (!recipe) {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe_id}/information?apiKey=${API_KEY}`
      );
      const fetchedRecipe = response.data;

      if (!fetchedRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      await knex("recipes").insert({
        id: fetchedRecipe.id,
        name: fetchedRecipe.title,
        category: fetchedRecipe.dishTypes[0] || "Uncategorized",
        image_url: fetchedRecipe.image,
        source_url: fetchedRecipe.sourceUrl,
        steps: fetchedRecipe.instructions || "No steps provided.",
        ready_in_minutes: fetchedRecipe.readyInMinutes || null,
        servings: fetchedRecipe.servings || null,
      });
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
