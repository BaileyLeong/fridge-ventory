import initKnex from "knex";
import configuration from "../knexfile.js";
import axios from "axios";
const knex = initKnex(configuration);

const API_KEY = process.env.SPOONACULAR_API_KEY;

export const seed = async function (knex) {
  try {
    const spoonacularURL = `https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`;
    const response = await axios.get(spoonacularURL);

    const recipes = data.recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.title,
      category: recipe.dishTypes?.[0] || "Uncategorized",
      image_url: recipe.image || "https://placehold.co/100",
      ingredients: recipe.extendedIngredients.map((ing) => ing.name).join(", "),
      source_url: recipe.sourceUrl || "https://spoonacular.com",
      steps: recipe.instructions || "No steps provided.",
      ready_in_minutes: recipe.readyInMinutes || "Not provided.",
      servings: recipe.servings || "Not provided.",
    }));

    for (const recipe of recipes) {
      const existingRecipe = await knex("recipes")
        .where({ id: recipe.id })
        .first();
      if (!existingRecipe) {
        await knex("recipes").insert(recipe);
        console.log(`Inserted recipe: ${recipe.name}`);
      } else {
        console.log(`Skipped duplicate recipe: ${recipe.name}`);
      }
    }

    console.log("Spoonacular recipes added!");
  } catch (error) {
    console.error("Error fetching Spoonacular recipes:", error);
  }
};

export { seed };
