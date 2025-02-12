export async function seed(knex) {
  await knex("favorite_recipes").del();

  const users = await knex("users").select("id");
  const recipes = await knex("recipes").select("id");

  if (users.length === 0 || recipes.length === 0) {
    console.error(
      "Skipping favorite_recipes seeding: No users or recipes found."
    );
    return;
  }

  await knex("favorite_recipes").insert([
    { user_id: users[0].id, recipe_id: recipes[0].id },
    {
      user_id: users[1]?.id || users[0].id,
      recipe_id: recipes[1]?.id || recipes[0].id,
    },
  ]);

  console.log("Seeded favorite recipes successfully!");
}
