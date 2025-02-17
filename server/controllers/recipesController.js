import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);

const API_KEY = process.env.SPOONACULAR_API_KEY;

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await knex("recipes").select(
      "id",
      "name",
      "ingredients",
      "steps",
      "category",
      "image_url",
      "ready_in_minutes",
      "servings",
      "source_url"
    );

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

export const suggestRecipes = async (req, res) => {
  try {
    const user_id = req.user.id;

    const fridgeItems = await knex("fridge_items")
      .where({ user_id })
      .pluck("ingredient_id");

    if (fridgeItems.length === 0) {
      return res.status(400).json({ error: "No ingredients found in fridge." });
    }

    const ingredientList = fridgeItems.join(",");

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: {
          ingredients: ingredientList,
          number: 5,
          apiKey: API_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "No recipes found." });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching suggested recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipe suggestions." });
  }
};

export const addRecipe = async (req, res) => {
  try {
    const {
      id,
      name,
      category,
      image_url,
      ingredients,
      source_url,
      steps,
      ready_in_minutes,
      servings,
    } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: "Recipe must have an id and name" });
    }

    const existingRecipe = await knex("recipes").where({ id }).first();

    if (existingRecipe) {
      return res.status(409).json({ error: "Recipe already exists" });
    }

    await knex("recipes").insert({
      id,
      name,
      category: category || "Uncategorized",
      image_url: image_url || "https://placehold.co/100",
      ingredients,
      source_url: source_url || "https://spoonacular.com",
      steps: steps || "No steps provided.",
      ready_in_minutes: ready_in_minutes || null,
      servings: servings || null,
    });

    res.status(201).json({ message: "Recipe added successfully" });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};
