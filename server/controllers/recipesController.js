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
    console.log("Received request at /recipes/suggest");

    const user_id = req.user.id;
    console.log("User ID:", user_id);

    const {
      dietaryRestrictions = "",
      allergens = "",
      cuisines = [],
      mealTypes = [],
    } = req.body;

    const ingredientNames = await knex("fridge_items")
      .join("ingredients", "fridge_items.ingredient_id", "ingredients.id")
      .where("fridge_items.user_id", user_id)
      .pluck("ingredients.name");

    console.log("Ingredient Names:", ingredientNames);

    if (ingredientNames.length === 0) {
      console.warn("No ingredients found in fridge.");
      return res.status(400).json({ error: "No ingredients found in fridge." });
    }

    const ingredientList = ingredientNames.join(",");
    console.log("Querying Spoonacular with ingredients:", ingredientList);

    const response = await axios.get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
      {
        params: {
          query: "meal",
          includeIngredients: ingredientList,
          diet: dietaryRestrictions || undefined,
          intolerances: allergens || undefined,
          cuisine: cuisines.length > 0 ? cuisines.join(",") : undefined,
          type: mealTypes.length > 0 ? mealTypes.join(",") : undefined,
          number: 2,
          addRecipeInformation: true,
          addRecipeInstructions: true,
          fillIngredients: true,
          sort: "max-used-ingredients",
        },
        headers: { "x-rapidapi-key": API_KEY },
      }
    );

    console.log("Spoonacular Response:", response.data);

    if (!response.data || response.data.results.length === 0) {
      console.warn("No recipes found.");
      return res.status(404).json({ error: "No recipes found." });
    }

    const mealTypePriority = [
      "breakfast",
      "lunch",
      "dinner",
      "main course",
      "side dish",
      "snack",
      "appetizer",
      "salad",
      "soup",
      "bread",
      "dessert",
      "beverage",
      "sauce",
      "marinade",
      "fingerfood",
      "drink",
    ];

    for (const recipe of response.data.results) {
      const validDishTypes = recipe.dishTypes
        ? recipe.dishTypes.filter((type) => mealTypePriority.includes(type))
        : [];
      const selectedMealType =
        validDishTypes.length > 0
          ? validDishTypes.sort(
              (a, b) =>
                mealTypePriority.indexOf(a) - mealTypePriority.indexOf(b)
            )[0]
          : "main course";

      const existingRecipe = await knex("recipes")
        .where("id", recipe.id)
        .first();

      if (!existingRecipe) {
        await knex("recipes").insert({
          id: recipe.id,
          name: recipe.title,
          category: selectedMealType,
          image_url: recipe.image || "https://placehold.co/500",
          ready_in_minutes: recipe.readyInMinutes,
          servings: recipe.servings,
          steps: recipe.instructions || "No instructions available.",
          source_url: recipe.sourceUrl,
        });

        for (const ingredient of recipe.usedIngredients || []) {
          const existingIngredient = await knex("ingredients")
            .where("id", ingredient.id)
            .first();

          if (!existingIngredient) {
            await knex("ingredients").insert({
              id: ingredient.id,
              name: ingredient.name,
            });
          }

          await knex("recipe_ingredients").insert({
            recipe_id: recipe.id,
            ingredient_id: ingredient.id,
            amount_us: ingredient.amount || null,
            unit_us: ingredient.unit || null,
            amount_metric: ingredient.amount || null,
            unit_metric: ingredient.unit || null,
          });
        }
      }
    }

    const formattedRecipes = response.data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      sourceUrl: recipe.sourceUrl,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      likes: recipe.aggregateLikes || 0,
      meal_type: recipe.dishTypes ? recipe.dishTypes[0] : "main course",
      usedIngredients:
        recipe.usedIngredients?.map((ing) => ({
          id: ing.id,
          name: ing.name,
          image: ing.image || null,
          original: ing.original,
          amount: ing.amount,
          unit: ing.unit,
        })) || [],
      missedIngredients:
        recipe.missedIngredients?.map((ing) => ({
          id: ing.id,
          name: ing.name,
          image: ing.image || null,
          original: ing.original,
          amount: ing.amount,
          unit: ing.unit,
        })) || [],
    }));

    console.log("Formatted Recipes:", formattedRecipes);

    res.status(200).json(formattedRecipes);
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

    const existingRecipeById = await knex("recipes").where({ id }).first();
    if (existingRecipeById) {
      return res.status(409).json({ error: "Recipe already exists by ID" });
    }

    const existingRecipeByName = await knex("recipes")
      .whereRaw("LOWER(name) = ?", [name.toLowerCase()])
      .first();

    if (existingRecipeByName) {
      return res
        .status(409)
        .json({ error: "Recipe with this name already exists" });
    }

    await knex("recipes").insert({
      id,
      name,
      category: category || "Uncategorized",
      image_url: image_url || "https://placehold.co/500",
      source_url: source_url || "https://spoonacular.com",
      steps: steps || "No steps provided.",
      ready_in_minutes: ready_in_minutes || null,
      servings: servings || null,
    });

    if (ingredients && Array.isArray(ingredients)) {
      const ingredientIds = ingredients.map((ing) => ing.id);
      const existingIngredients = await knex("ingredients")
        .whereIn("id", ingredientIds)
        .pluck("id");

      const missingIngredients = ingredients.filter(
        (ing) => !existingIngredients.includes(ing.id)
      );

      if (missingIngredients.length > 0) {
        await knex("ingredients").insert(
          missingIngredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
          }))
        );
      }

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
