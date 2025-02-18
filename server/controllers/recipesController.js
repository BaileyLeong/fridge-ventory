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
      "category",
      "image_url",
      "ready_in_minutes",
      "servings",
      "steps",
      "source_url"
    );

    const recipesWithIngredients = await Promise.all(
      recipes.map(async (recipe) => {
        const ingredients = await knex("recipe_ingredients")
          .join(
            "ingredients",
            "recipe_ingredients.ingredient_id",
            "ingredients.id"
          )
          .where("recipe_ingredients.recipe_id", recipe.id)
          .select(
            "ingredients.id as ingredient_id",
            "ingredients.name",
            "recipe_ingredients.amount_us",
            "recipe_ingredients.unit_us",
            "recipe_ingredients.amount_metric",
            "recipe_ingredients.unit_metric"
          );
        return { ...recipe, ingredients };
      })
    );

    res.status(200).json(recipesWithIngredients);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await knex("recipes").where({ id: req.params.id }).first();
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const ingredients = await knex("recipe_ingredients")
      .join("ingredients", "recipe_ingredients.ingredient_id", "ingredients.id")
      .where("recipe_ingredients.recipe_id", recipe.id)
      .select(
        "ingredients.id as ingredient_id",
        "ingredients.name",
        "recipe_ingredients.amount_us",
        "recipe_ingredients.unit_us",
        "recipe_ingredients.amount_metric",
        "recipe_ingredients.unit_metric"
      );

    res.status(200).json({ ...recipe, ingredients });
  } catch (error) {
    console.error("Error fetching recipe:", error);
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
      source_url,
      steps,
      ready_in_minutes,
      servings,
      ingredients,
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
      source_url: source_url || "https://spoonacular.com",
      steps: steps || "No steps provided.",
      ready_in_minutes: ready_in_minutes || null,
      servings: servings || null,
    });

    if (ingredients && Array.isArray(ingredients)) {
      const recipeIngredientsData = ingredients.map((ingredient) => ({
        recipe_id: id,
        ingredient_id: ingredient.id,
        amount_us: ingredient.amount_us || null,
        unit_us: ingredient.unit_us || null,
        amount_metric: ingredient.amount_metric || null,
        unit_metric: ingredient.unit_metric || null,
      }));

      await knex("recipe_ingredients").insert(recipeIngredientsData);
    }

    res.status(201).json({ message: "Recipe added successfully" });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};
