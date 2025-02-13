export async function seed(knex) {
  await knex("recipes").del();

  await knex("recipes").insert([
    {
      id: 649004,
      name: "Kohlrabi Salad With Apple, Bacon, and Snow Peas",
      category: "Salad",
      image_url: "https://img.spoonacular.com/recipes/649004-312x231.jpg",
      ingredients:
        "kohlrabi, apple, bacon, snow peas, sunflower seeds, heavy cream, apple cider vinegar, honey",
      source_url:
        "https://spoonacular.com/kohlrabi-salad-with-apple-bacon-and-snow-peas-649004",
      steps:
        "Slice the kohlrabi, mix with apple and snow peas, toss with sunflower seeds, mix dressing, and serve.",
      ready_in_minutes: 45,
      servings: 1,
    },
    {
      id: 640136,
      name: "Corned Beef And Cabbage With Irish Mustard Sauce",
      category: "Main Course",
      image_url: "https://img.spoonacular.com/recipes/640136-312x231.jpg",
      ingredients:
        "corned beef brisket, cabbage, carrot, onion, parsley, bay leaf, black pepper, salt, mustard, vinegar, egg yolks, butter, horseradish",
      source_url:
        "https://spoonacular.com/corned-beef-and-cabbage-with-irish-mustard-sauce-640136",
      steps:
        "Boil corned beef, add vegetables, prepare mustard sauce, and serve with sauce.",
      ready_in_minutes: 270,
      servings: 6,
    },
    {
      id: 715594,
      name: "Homemade Mac and Cheese",
      category: "Main Course",
      image_url: "https://img.spoonacular.com/recipes/715594-312x231.jpg",
      ingredients: "pasta, cheddar cheese, milk, butter, flour, salt, pepper",
      source_url: "https://spoonacular.com/homemade-mac-and-cheese-715594",
      steps: "Cook pasta, make cheese sauce, mix together, and bake.",
      ready_in_minutes: 30,
      servings: 4,
    },
  ]);

  console.log("Seeded recipes successfully!");
}
