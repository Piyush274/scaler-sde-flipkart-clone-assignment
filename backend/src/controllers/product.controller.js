import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    const productIds = products.map((product) => product._id);
    const images = await ProductImage.find({ product: { $in: productIds } }).lean();

    const imageMap = new Map();
    images.forEach((image) => {
      const key = image.product.toString();
      if (!imageMap.has(key)) {
        imageMap.set(key, []);
      }
      imageMap.get(key).push(image.imageUrl);
    });

    const result = products.map((product) => ({
      ...product,
      images: imageMap.get(product._id.toString()) || [],
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const images = await ProductImage.find({ product: product._id }).lean();

    res.status(200).json({
      ...product,
      images: images.map((image) => image.imageUrl),
    });
  } catch (error) {
    next(error);
  }
};
