/**
 * Initial POS schema for MySQL
 * Tables: products, sales, sale_items, purchases, purchase_items
 * Includes triggers to keep products.stock_qty consistent.
 */

exports.up = async function up(knex) {



  // USERS
  await knex.schema.createTable("users", (t) => {
    t.bigIncrements("id").primary();
    t.string("name", 255).notNullable();
    t.string("email", 255).notNullable().unique();
    t.string("password", 255).notNullable();
    t.string("role", 255).notNullable().defaultTo("user");
    t.timestamps(true, true);
  });

  // PRODUCTS
  await knex.schema.createTable("products", (t) => {
    t.bigIncrements("id").primary();
    t.string("name", 255).notNullable();
    t.string("sku", 128).notNullable().unique();
    t.decimal("price", 10, 2).notNullable().defaultTo(0.0);
    t.integer("stock_qty").unsigned().notNullable().defaultTo(0);
    t.timestamps(true, true);
  });

  // SALES (bill header)
  await knex.schema.createTable("sales", (t) => {
    t.bigIncrements("id").primary();
    t.bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    t.string("invoice_no", 64).nullable().unique();
    t.decimal("total_amount", 12, 2).notNullable().defaultTo(0.0);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });

  // SALE ITEMS (bill lines)
  await knex.schema.createTable("sale_items", (t) => {
    t.bigIncrements("id").primary();
    t.bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    t.bigInteger("sale_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("sales")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    t.bigInteger("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products")
    t.integer("quantity").unsigned().notNullable();
    t.decimal("price", 10, 2).notNullable();
    t.decimal("line_total", 12, 2).notNullable();
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("sale_items");
  await knex.schema.dropTableIfExists("sales");
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("users");
};
