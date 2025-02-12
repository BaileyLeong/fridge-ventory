export function up(knex) {
  return knex.schema.createTable("fridge_items", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.integer("quantity").notNullable();
    table.date("expiry_date");
    table.string("category");
    table.timestamp("added_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("fridge_items");
}
