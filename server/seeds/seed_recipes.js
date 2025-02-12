export function seed(knex) {
  return knex("recipes")
    .del()
    .then(() => {
      return knex("recipes").insert([
        {
          name: "Pancakes",
          ingredients: "Flour, Milk, Eggs, Sugar",
          steps: "Mix ingredients, cook on pan.",
          category: "Breakfast",
        },
        {
          name: "Omelette",
          ingredients: "Eggs, Cheese, Onion, Salt",
          steps: "Whisk eggs, cook with toppings.",
          category: "Breakfast",
        },
      ]);
    });
}
