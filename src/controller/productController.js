const db = require('../../config/dbConfig');

const list = async (req, res) => {
  try {
    const products = await db("products").select("*").orderBy("id", "desc");

    return res.status(200).json({
      data: products,
      message: "Products fetched successfully",
    });
  } catch (err) {
    console.error("listProducts error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({
      data: product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    console.error("getProduct error:", err);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, price = 0, stock_qty = 0 } = req.body || {};
    if (!name || !sku) {
      return res.status(400).json({ error: "name and sku are required" });
    }
    const [id] = await db("products").insert({ name, sku, price, stock_qty });
    const created = await db("products").where({ id }).first();
    return res.status(201).json({
      data: created,
      message: "Product created successfully",
    });
  } catch (err) {
    console.error("createProduct error:", err);
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "SKU already exists" });
    }
    return res.status(500).json({ error: "Failed to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, sku, price, stock_qty } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ error: "name and sku are required" });
    }

    const affected = await db("products")
      .where({ id })
      .update({ name, sku, price, stock_qty });

    if (!affected) return res.status(404).json({ error: "Product not found" });

    const updated = await db("products").where({ id }).first();

    return res.status(200).json({
      data: updated,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const affected = await db("products").where({ id }).del();

    if (!affected) return res.status(404).json({ error: "Product not found" });

    return res.status(200).json({
      data: null,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  list,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
