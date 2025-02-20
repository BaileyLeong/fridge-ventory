export const up = function (knex) {
  return knex.schema.createTable("recipes", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("category");
    table.string("image_url").defaultTo("https://placehold.co/500");
    table.integer("ready_in_minutes");
    table.integer("servings");
    table.text("steps").notNullable();
    table.text("source_url");
    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("recipes");
};
