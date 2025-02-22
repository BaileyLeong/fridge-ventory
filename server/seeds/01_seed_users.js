export const seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Bailey",
      email: "bailey@example.com",
      dietary_restrictions: null,
      allergens: null,
    },
    {
      name: "Joe",
      email: "joe@example.com",
      dietary_restrictions: "vegetarian, gluten-free",
      allergens: "peanuts, shellfish",
    },
  ]);
};
