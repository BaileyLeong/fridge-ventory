export const seed = async function (knex) {
  await knex("recipes").del(); // Clear existing data

  await knex("recipes").insert([
    {
      id: 649004,
      name: "Kohlrabi Salad With Apple, Bacon, and Snow Peas",
      category: "Salad",
      image_url: "https://img.spoonacular.com/recipes/649004-556x370.jpg",
      steps:
        "Slice the kohlrabi paper thin, mix with chopped apple, toss in snow peas and sunflower seeds, crumble the bacon finely and mix it in, refrigerate, mix vinegar into cream, add honey and mix well, add dressing to salad until coated.",
      ready_in_minutes: 45,
      servings: 1,
      source_url:
        "https://spoonacular.com/kohlrabi-salad-with-apple-bacon-and-snow-peas-649004",
    },
    {
      id: 640136,
      name: "Corned Beef And Cabbage With Irish Mustard Sauce",
      category: "Dinner",
      image_url: "https://img.spoonacular.com/recipes/640136-556x370.jpg",
      steps:
        "Combine corned beef and water to cover in a large Dutch oven; bring to a boil. Drain and add fresh water. Add onion, carrot, parsley, bay leaf, and pepper. Cover and simmer for 4 hours. Add potatoes, then cabbage, simmer until tender. Remove bay leaf. Make mustard sauce by mixing cornstarch, sugar, mustard, salt, water, vinegar, butter, and horseradish. Stir in yolks and cook until thick. Serve with corned beef and vegetables.",
      ready_in_minutes: 270,
      servings: 6,
      source_url:
        "https://spoonacular.com/corned-beef-and-cabbage-with-irish-mustard-sauce-640136",
    },
    {
      id: 715594,
      name: "Homemade Garlic and Basil French Fries",
      category: "Side Dish",
      image_url: "https://img.spoonacular.com/recipes/715594-556x370.jpg",
      steps:
        "Slice potatoes, coat in flour, garlic powder, and basil. Fry in vegetable oil until golden brown. Sprinkle with garlic salt and serve.",
      ready_in_minutes: 45,
      servings: 2,
      source_url: "http://www.pinkwhen.com/homemade-french-fries/",
    },
  ]);
};
