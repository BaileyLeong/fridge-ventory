export const up = function (knex) {
  return knex.schema.createTable("ingredients", function (table) {
    table.increments("id").primary();
    table.string("name").unique().notNullable();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("ingredients");
};
