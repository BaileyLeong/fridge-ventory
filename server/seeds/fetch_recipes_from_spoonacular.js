import axios from "axios";

export async function seed(knex) {
  await knex("recipes").del();

  try {
    const API_KEY = process.env.SPOONACULAR_API_KEY;
    const recipeResponse = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`
    );

    const recipes = recipeResponse.data.recipes;

    const recipeData = recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.title,
      ingredients: recipe.extendedIngredients.map((ing) => ing.name).join(", "),
      steps:
        recipe.analyzedInstructions[0]?.steps
          .map((step) => step.step)
          .join(" ") || "No steps available",
      category: recipe.dishTypes[0] || "Uncategorized",
    }));

    await knex("recipes").insert(recipeData);

    console.log("Seeded recipes successfully!");
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}
