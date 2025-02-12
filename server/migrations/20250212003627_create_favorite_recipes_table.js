export function up(knex) {
  return knex.schema.createTable("recipes", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("ingredients").notNullable();
    table.text("steps").notNullable();
    table.string("category");
  });
}

export function down(knex) {
  return knex.schema.dropTable("recipes");
}
