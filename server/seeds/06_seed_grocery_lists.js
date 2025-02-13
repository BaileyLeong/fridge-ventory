export const seed = async function (knex) {
  await knex("grocery_lists").del();
  await knex("grocery_lists").insert([
    {
      id: 1,
      user_id: 1,
      ingredient_id: 5,
      quantity: 500,
      unit: "g",
      completed: false,
    }, // Sugar
  ]);
};
