export const seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert([
    { name: "Bailey", email: "bailey@example.com" },
    { name: "Joe", email: "joe@example.com" },
  ]);
};
