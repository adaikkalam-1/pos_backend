const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Clear tables in correct order
  await knex("sale_items").del();
  await knex("sales").del();
  await knex("products").del();
  await knex("users").del();

  // Insert a user (admin)
  const [userInsertId] = await knex("users").insert(
    {
      name: "John Doe",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin@123", 10),
      role: "admin",
    }
  );

  const userId = userInsertId; // MySQL returns numeric insertId

  // Insert products
  const firstProductId = await knex("products")
    .insert([
      { name: "Coca Cola 500ml", sku: "SKU001", price: 1.5, stock_qty: 100 },
      { name: "Lays Chips 100g", sku: "SKU002", price: 2.0, stock_qty: 50 },
      { name: "Dairy Milk Chocolate", sku: "SKU003", price: 1.2, stock_qty: 80 },
    ])
    .then((ids) => ids[0]);

  const p1_id = firstProductId;
  const p2_id = firstProductId + 1;
  const p3_id = firstProductId + 2;

  // Insert sale (bill header)
  const [saleInsertId] = await knex("sales").insert(
    {
      invoice_no: `INV-00001`,
      total_amount: 6.20,
      user_id: userId,
    }
  );

  const saleId = saleInsertId;

  // Insert sale items (all must include user_id!)
  await knex("sale_items").insert([
    {
      sale_id: saleId,
      product_id: p1_id,
      quantity: 2,
      price: 1.5,
      line_total: 3.0,
      user_id: userId,
    },
    {
      sale_id: saleId,
      product_id: p2_id,
      quantity: 1,
      price: 2.0,
      line_total: 2.0,
      user_id: userId,
    },
    {
      sale_id: saleId,
      product_id: p3_id,
      quantity: 1,
      price: 1.2,
      line_total: 1.2,
      user_id: userId,
    },
  ]);
};
