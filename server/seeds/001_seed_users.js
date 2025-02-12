export function seed(knex) {
  return knex("users")
    .del()
    .then(() => {
      return knex("users").insert([
        { id: 1, name: "Bailey", email: "bailey@example.com" },
        { id: 2, name: "Joe", email: "joe@example.com" },
      ]);
    });
}
