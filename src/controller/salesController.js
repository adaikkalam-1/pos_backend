const db = require("../../config/dbConfig");

// Create a sale with items and decrement stock atomically
const createSale = async (req, res) => {
  const { items = [] } = req.body || {};
  const { id: user_id } = req.user;
  console.log(user_id);
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array is required" });
  }

  try {
    const result = await db.transaction(async (trx) => {
      const prepared = [];

      for (const item of items) {
        const { product_id, quantity } = item || {};
        if (!product_id || !quantity ) {
          throw new Error("Each item requires product_id, quantity");
        }

        // Lock product row for update
        const product = await trx("products")
          .where({ id: product_id })
          .forUpdate()
          .first();

        if (!product) {
          throw new Error(`Product ${product_id} not found`);
        }
        if (product.stock_qty < quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}.`
          );
        }

        // Decrement stock
        await trx("products")
          .where({ id: product_id })
          .update({ stock_qty: product.stock_qty - quantity });

        const line_total = Number(product.price) * Number(quantity);
        prepared.push({ product_id, quantity, price: product.price, line_total });
      }

      const total_amount = prepared.reduce(
        (sum, it) => sum + Number(it.line_total),
        0
      );
      const lastSale = await trx("sales").orderBy("id", "desc").first();
      const nextId = lastSale ? lastSale.id + 1 : 1;
      const invoice_no = `INV-${nextId.toString().padStart(5, "0")}`;
      // Insert sale header
      const [sale_id] = await trx("sales").insert({
        invoice_no,
        total_amount,
        created_at: trx.fn.now(),
        user_id,
      });

      const rows = prepared.map((it) => ({
        sale_id,
        user_id,
        product_id: it.product_id,
        quantity: it.quantity,
        price: it.price,
        line_total: it.line_total,
      }));
      await trx("sale_items").insert(rows);

      const header = await trx("sales").where({ id: sale_id }).first();
            const lineItems = await trx("sale_items as si")
        .join("products as p", "si.product_id", "p.id")
        .where("si.sale_id", sale_id)
        .select("si.*","p.name as product_name");
    

      return { sale: header, items: lineItems };
    });

    return res.status(201).json({
      data: result,
      message: "Sale created successfully",
    });
  } catch (err) {
    console.error("createSale error:", err);
    return res.status(400).json({
      error: err.message || "Failed to create sale",
    });
  }
};

const listSales = async (req, res) => {
  try {
    let { search } = req.query;
    // Get sales first
    const sales = await db("sales")
      .join("users", "sales.user_id", "users.id")
      .select("sales.id", "sales.invoice_no", "sales.total_amount", "sales.created_at", "users.name as user_name", "users.email as user_email")
      .orderBy("sales.id", "desc");

    // Get sale items with product details
    let query = db("sale_items")
      .join("products", "sale_items.product_id", "products.id")
      .select(
        "sale_items.sale_id",
        "sale_items.quantity",
        "sale_items.price",
        "sale_items.line_total",
        "products.id as product_id",
        "products.name as product_name",
        "products.sku"
      );

    if (search) {
      query.where("products.name", "like", `%${search}%`);
    }
    const saleItems = await query;
    // Group items by sale_id
    const salesWithItems = sales.map((sale) => {
      const items = saleItems.filter((i) => i.sale_id === sale.id);
      return { ...sale, items };
    });

    return res.status(200).json({
      data: salesWithItems,
      message: "Sales fetched successfully",
    });
  } catch (err) {
    console.error("listSales error:", err);
    return res.status(500).json({ error: "Failed to fetch sales" });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await db("sales").where({ id }).first();
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const items = await db("sale_items").where({ sale_id: id }).select("*");
    return res.status(200).json({
      data: { sale, items },
      message: "Sale fetched successfully",
    });
  } catch (err) {
    console.error("getSaleById error:", err);
    return res.status(500).json({ error: "Failed to fetch sale" });
  }
};

module.exports = {
  createSale,
  listSales,
  getSaleById,
};
