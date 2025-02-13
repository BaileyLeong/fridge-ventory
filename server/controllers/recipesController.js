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

// export const suggestRecipes = async (_req, res) => {
//   try {
//     const fridgeItems = await knex("fridge_items").select("name");
//     const ingredientList = fridgeItems.map((item) => item.name).join(",");

//     const findByIngredientsURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=5&apiKey=${API_KEY}`;
//     const response = await axios.get(findByIngredientsURL);

//     if (!response.data || response.data.length === 0) {
//       return res.status(404).json({ error: "No recipes found" });
//     }

//     const recipeRequests = response.data.map((recipe) =>
//       axios.get(
//         `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
//       )
//     );

//     const recipeResponses = await Promise.all(recipeRequests);
//     const fullRecipes = recipeResponses.map((res) => res.data);

//     res.status(200).json(fullRecipes);
//   } catch (error) {
//     console.error("Error fetching suggested recipes:", error);
//     res.status(500).json({ error: "Failed to fetch recipe suggestions" });
//   }
// };

export const suggestRecipes = async (_req, res) => {
  try {
    console.warn("⚠️ Using mock data (API limit reached).");

    const mockRecipes = [
      {
        id: 991625,
        title: "Nutella Buttercream Cupcakes with Hidden Cadbury Egg",
        image: "https://img.spoonacular.com/recipes/991625-312x231.jpg",
        aggregateLikes: 14,
        usedIngredients: [
          {
            id: 1123,
            name: "egg",
            original: "2 eggs",
            image: "https://spoonacular.com/cdn/ingredients_100x100/egg.png",
          },
          {
            id: 1077,
            name: "milk",
            original: "1 cup milk",
            image: "https://spoonacular.com/cdn/ingredients_100x100/milk.png",
          },
        ],
        missedIngredients: [
          {
            id: 19335,
            name: "sugar",
            original: "1 cup sugar",
            image:
              "https://spoonacular.com/cdn/ingredients_100x100/sugar-in-bowl.png",
          },
        ],
        instructions: "Mix, bake, and enjoy!",
        readyInMinutes: 45,
        servings: 4,
      },
    ];

    res.status(200).json(mockRecipes);
  } catch (error) {
    console.error("Error fetching suggested recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipe suggestions" });
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

    const [newRecipe] = await knex("recipes").insert({
      id,
      name,
      category: category || "Uncategorized",
      image_url: image_url || "https://placehold.co/100",
      ingredients,
      source_url: source_url || "https://spoonacular.com",
      steps: steps || "No steps provided.",
      ready_in_minutes: ready_in_minutes || "No time provided.",
      servings: servings || "No servings provided.",
    });

    res.status(201).json({ message: "Recipe added successfully", newRecipe });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};
