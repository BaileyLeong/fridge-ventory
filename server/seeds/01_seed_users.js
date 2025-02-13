export const seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert([
    { id: 1, name: "Bailey", email: "bailey@example.com" },
    { id: 2, name: "Joe", email: "joe@example.com" },
  ]);
};
