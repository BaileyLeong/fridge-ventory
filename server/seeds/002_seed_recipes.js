export async function seed(knex) {
  await knex("recipes").del();

  await knex("recipes").insert([
    {
      id: 1,
      name: "Pancakes",
      category: "Breakfast",
      image_url: "https://example.com/pancakes.jpg",
      ingredients: "Flour, Milk, Eggs, Sugar",
      source_url: "https://example.com/pancakes-recipe",
      steps: "Mix ingredients, cook on pan.",
    },
    {
      id: 2,
      name: "Omelette",
      category: "Breakfast",
      image_url: "https://example.com/omelette.jpg",
      ingredients: "Eggs, Cheese, Onion, Salt",
      source_url: "https://example.com/omelette-recipe",
      steps: "Whisk eggs, cook with toppings.",
    },
  ]);

  console.log("Seeded recipes successfully!");
}
