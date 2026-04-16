import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId });
  }
  return cart;
};

const buildCartResponse = async (cartId) => {
  const items = await CartItem.find({ cart: cartId })
    .populate("product", "title price category stock")
    .lean();

  const productIds = items
    .map((item) => item.product?._id)
    .filter((id) => id != null);

  const productImages = await ProductImage.find({
    product: { $in: productIds },
  }).lean();

  const imageMap = new Map();
  productImages.forEach((image) => {
    const key = image.product.toString();
    if (!imageMap.has(key)) {
      imageMap.set(key, []);
    }
    imageMap.get(key).push(image.imageUrl);
  });

  const normalizedItems = items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      images: imageMap.get(item.product?._id?.toString()) || [],
    },
  }));

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return { items: normalizedItems, subtotal, totalPrice: subtotal };
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const data = await buildCartResponse(cart._id);
    res.status(200).json({ cartId: cart._id, ...data });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "productId is required." });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a positive integer." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItem = await CartItem.findOne({
      cart: cart._id,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({ cart: cart._id, product: productId, quantity });
    }

    const data = await buildCartResponse(cart._id);
    res.status(201).json({ cartId: cart._id, ...data });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a positive integer." });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = await CartItem.findOne({ _id: req.params.id, cart: cart._id });

    if (!item) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    item.quantity = quantity;
    await item.save();

    const data = await buildCartResponse(cart._id);
    res.status(200).json({ cartId: cart._id, ...data });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const deletedItem = await CartItem.findOneAndDelete({
      _id: req.params.id,
      cart: cart._id,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const data = await buildCartResponse(cart._id);
    res.status(200).json({ cartId: cart._id, ...data });
  } catch (error) {
    next(error);
  }
};
