export function seed(knex) {
  return knex("fridge_items")
    .del()
    .then(() => {
      return knex("fridge_items").insert([
        {
          user_id: 1,
          name: "Milk",
          quantity: 1,
          expiry_date: "2024-02-20",
          category: "Dairy",
        },
        {
          user_id: 1,
          name: "Eggs",
          quantity: 12,
          expiry_date: "2024-02-25",
          category: "Protein",
        },
      ]);
    });
}
