export const seed = async function (knex) {
  await knex("meal_plans").del();
  await knex("meal_plans").insert([
    { id: 1, user_id: 1, recipe_id: 649004, planned_date: "2025-02-20" },
  ]);
};
