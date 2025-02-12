export async function seed(knex) {
  await knex("fridge_items").del();

  const users = await knex("users").select("id");
  if (users.length === 0) {
    console.error("No users found, skipping fridge_items seeding.");
    return;
  }

  const userId = users[0].id;

  await knex("fridge_items").insert([
    {
      user_id: userId,
      name: "Milk",
      quantity: 1,
      expiry_date: "2024-02-20",
      category: "Dairy",
    },
    {
      user_id: userId,
      name: "Eggs",
      quantity: 12,
      expiry_date: "2024-02-25",
      category: "Protein",
    },
  ]);
}
