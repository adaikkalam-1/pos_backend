// exports.seed = async function (knex) {
//   // Deletes ALL existing entries (in correct order)
//   await knex("sale_items").del();
//   await knex("sales").del();
//   await knex("products").del();

//   // Insert products
//   const [p1_id, p2_id, p3_id] = await knex("products").insert([
//     { name: "Coca Cola 500ml", sku: "SKU001", price: 1.50, stock_qty: 100 },
//     { name: "Lays Chips 100g", sku: "SKU002", price: 2.00, stock_qty: 50 },
//     { name: "Dairy Milk Chocolate", sku: "SKU003", price: 1.20, stock_qty: 80 },
//   ]);

//   // Insert a sample sale (bill header)
//   const [sale_id] = await knex("sales").insert({
//     invoice_no: `INV-${Date.now()}`,
//     total_amount: 5.50,
//   });

//   // Insert sale items (lines)
//   await knex("sale_items").insert([
//     {
//       sale_id: sale_id,
//       product_id: p1_id,
//       quantity: 2,
//       price: 1.50,
//       line_total: 3.00,
//     },
//     {
//       sale_id: sale_id,
//       product_id: p2_id,
//       quantity: 1,
//       price: 2.50,
//       line_total: 2.50,
//     },
//     {
//       sale_id: sale_id,
//       product_id: p3_id,
//       quantity: 1,
//       price: 1.20,
//       line_total: 1.20,
//     },
//   ]);
// };

exports.seed = async function (knex) {
  // Deletes ALL existing entries (in correct order due to foreign keys)
  await knex("sale_items").del();
  await knex("sales").del();
  await knex("products").del();

  // Insert products (capture inserted IDs manually)
  const productIds = await knex("products").insert([
    { name: "Coca Cola 500ml", sku: "SKU001", price: 1.50, stock_qty: 100 },
    { name: "Lays Chips 100g", sku: "SKU002", price: 2.00, stock_qty: 50 },
    { name: "Dairy Milk Chocolate", sku: "SKU003", price: 1.20, stock_qty: 80 },
  ]);

  // productIds will be [firstInsertedId] only in MySQL
  const firstProductId = productIds[0];

  // Since MySQL doesn’t return multiple IDs, we calculate them manually
  const p1_id = firstProductId;
  const p2_id = firstProductId + 1;
  const p3_id = firstProductId + 2;

  // Insert a sample sale (bill header)
  const saleInsert = await knex("sales").insert({
    invoice_no: `INV-${Date.now()}`,
    total_amount: 5.70,
  });

  const sale_id = saleInsert[0]; // MySQL returns [insertId]

  // Insert sale items (lines)
  await knex("sale_items").insert([
    {
      sale_id: sale_id,
      product_id: p1_id,
      quantity: 2,
      price: 1.50,
      line_total: 3.00,
    },
    {
      sale_id: sale_id,
      product_id: p2_id,
      quantity: 1,
      price: 2.00,
      line_total: 2.00,
    },
    {
      sale_id: sale_id,
      product_id: p3_id,
      quantity: 1,
      price: 1.20,
      line_total: 1.20,
    },
  ]);
};
