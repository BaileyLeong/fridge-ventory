export function seed(knex) {
  return knex("users")
    .del()
    .then(() => {
      return knex("users").insert([
        { name: "Bailey", email: "bailey@example.com" },
        { name: "Joe", email: "joe@example.com" },
      ]);
    });
}
