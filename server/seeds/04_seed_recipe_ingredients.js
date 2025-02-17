export const seed = async function (knex) {
  await knex("recipe_ingredients").del(); // Clear existing data

  await knex("recipe_ingredients").insert([
    // Kohlrabi Salad With Apple, Bacon, and Snow Peas
    {
      recipe_id: 649004,
      ingredient_id: 11241,
      amount_us: 1,
      unit_us: "small",
      amount_metric: 1,
      unit_metric: "small",
    },
    {
      recipe_id: 649004,
      ingredient_id: 1049003,
      amount_us: 0.25,
      unit_us: "cup",
      amount_metric: 31.25,
      unit_metric: "g",
    },
    {
      recipe_id: 649004,
      ingredient_id: 11300,
      amount_us: 10,
      unit_us: null,
      amount_metric: 10,
      unit_metric: null,
    },
    {
      recipe_id: 649004,
      ingredient_id: 12036,
      amount_us: 1,
      unit_us: "Tbsp",
      amount_metric: 1,
      unit_metric: "Tbsp",
    },
    {
      recipe_id: 649004,
      ingredient_id: 10123,
      amount_us: 2,
      unit_us: "slice",
      amount_metric: 2,
      unit_metric: "slice",
    },

    // Corned Beef And Cabbage
    {
      recipe_id: 640136,
      ingredient_id: 10013346,
      amount_us: 4,
      unit_us: "lb",
      amount_metric: 1.814,
      unit_metric: "kgs",
    },
    {
      recipe_id: 640136,
      ingredient_id: 2004,
      amount_us: 1,
      unit_us: null,
      amount_metric: 1,
      unit_metric: null,
    },
    {
      recipe_id: 640136,
      ingredient_id: 11109,
      amount_us: 2,
      unit_us: "lb",
      amount_metric: 907.185,
      unit_metric: "g",
    },
    {
      recipe_id: 640136,
      ingredient_id: 11124,
      amount_us: 1,
      unit_us: "large",
      amount_metric: 1,
      unit_metric: "large",
    },

    // Homemade Garlic and Basil French Fries
    {
      recipe_id: 715594,
      ingredient_id: 2044,
      amount_us: 0.25,
      unit_us: "cup",
      amount_metric: 6,
      unit_metric: "g",
    },
    {
      recipe_id: 715594,
      ingredient_id: 11352,
      amount_us: 4,
      unit_us: null,
      amount_metric: 4,
      unit_metric: null,
    },
    {
      recipe_id: 715594,
      ingredient_id: 1022020,
      amount_us: 0.25,
      unit_us: null,
      amount_metric: 0.25,
      unit_metric: null,
    },
    {
      recipe_id: 715594,
      ingredient_id: 1062047,
      amount_us: 2,
      unit_us: "servings",
      amount_metric: 2,
      unit_metric: "servings",
    },
    {
      recipe_id: 715594,
      ingredient_id: 4669,
      amount_us: 2,
      unit_us: "servings",
      amount_metric: 2,
      unit_metric: "servings",
    },
  ]);
};
