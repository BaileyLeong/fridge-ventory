export const seed = async function (knex) {
  await knex("fridge_items").del();
  await knex("fridge_items").insert([
    {
      id: 1,
      user_id: 1,
      ingredient_id: 20081,
      quantity: 500,
      unit: "g",
      expires_at: "2025-03-01",
    }, // Flour
    {
      id: 2,
      user_id: 1,
      ingredient_id: 1077,
      quantity: 1,
      unit: "L",
      expires_at: "2025-02-20",
    }, // Milk
    {
      id: 3,
      user_id: 1,
      ingredient_id: 1123,
      quantity: 6,
      unit: "",
      expires_at: "2025-02-18",
    }, // Eggs
    {
      id: 4,
      user_id: 1,
      ingredient_id: 1001,
      quantity: 200,
      unit: "g",
      expires_at: "2025-04-10",
    }, // Butter
  ]);
};
