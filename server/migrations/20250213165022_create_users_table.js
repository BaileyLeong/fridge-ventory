export const up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("dietary_restrictions");
    table.string("allergens");
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("users");
};
