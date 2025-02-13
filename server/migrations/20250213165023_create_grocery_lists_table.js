export const up = function (knex) {
  return knex.schema.createTable("grocery_lists", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("ingredient_id").unsigned().notNullable();
    table.decimal("quantity", 10, 2).notNullable().defaultTo(0);
    table.string("unit", 50).notNullable().defaultTo("unit");
    table.boolean("completed").defaultTo(false);

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("ingredient_id")
      .references("id")
      .inTable("ingredients")
      .onDelete("CASCADE");
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("grocery_lists");
};
