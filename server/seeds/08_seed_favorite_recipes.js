export const seed = async function (knex) {
  await knex("favorite_recipes").del();
  await knex("favorite_recipes").insert([
    { id: 1, user_id: 1, recipe_id: 649004 },
  ]);
};
