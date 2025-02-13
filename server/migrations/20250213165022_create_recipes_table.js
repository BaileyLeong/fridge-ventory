export const up = function (knex) {
  return knex.schema.createTable("recipes", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("category");
    table.string("image_url").defaultTo("https://placehold.co/100");
    table.integer("ready_in_minutes");
    table.integer("servings");
    table.text("steps").notNullable();
    table.string("source_url");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("recipes");
};
