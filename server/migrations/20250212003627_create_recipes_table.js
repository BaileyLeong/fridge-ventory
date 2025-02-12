export function up(knex) {
  return knex.schema.createTable("recipes", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("ingredients").notNullable();
    table.text("steps").notNullable();
    table.string("category");
    table.string("image_url");
    table.integer("ready_in_minutes");
    table.integer("servings");
    table.string("source_url");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("recipes");
}
