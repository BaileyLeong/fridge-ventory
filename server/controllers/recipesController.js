import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await knex("recipes").select("*");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await knex("recipes").where({ id: req.params.id }).first();
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

export const suggestRecipes = async (_req, res) => {
  try {
    const fridgeItems = await knex("fridge_items").select("name");
    const ingredientList = fridgeItems.map((item) => item.name).join(",");

    const API_KEY = process.env.SPOONACULAR_API_KEY;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=5&apiKey=${API_KEY}`
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "No recipes found" });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch recipe suggestions" });
  }
};
