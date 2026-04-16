import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import ProductImage from "../models/productImage.model.js";

export const placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate(
      "product",
      "title price stock"
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const outOfStockItem = cartItems.find(
      (item) => !item.product || item.product.stock < item.quantity
    );
    if (outOfStockItem) {
      return res.status(400).json({
        error: "One or more products are out of stock for requested quantity.",
      });
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      totalPrice,
      status: "pending",
    });

    const orderItemsPayload = cartItems.map((item) => ({
      order: order._id,
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    await OrderItem.insertMany(orderItemsPayload);

    await Promise.all(
      cartItems.map((item) => {
        item.product.stock -= item.quantity;
        return item.product.save();
      })
    );

    await CartItem.deleteMany({ cart: cart._id });

    res.status(201).json({
      message: "Order placed successfully.",
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const items = await OrderItem.find({ order: order._id })
      .populate("product", "title category")
      .lean();

    res.status(200).json({ ...order, items });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order._id);
    const items = await OrderItem.find({ order: { $in: orderIds } })
      .populate("product", "title category")
      .lean();

    const productIds = items
      .map((item) => item.product?._id)
      .filter((id) => id != null);

    const images = await ProductImage.find({ product: { $in: productIds } }).lean();
    const imageMap = new Map();
    images.forEach((image) => {
      const key = image.product.toString();
      if (!imageMap.has(key)) {
        imageMap.set(key, []);
      }
      imageMap.get(key).push(image.imageUrl);
    });

    const itemsByOrder = new Map();
    items.forEach((item) => {
      const orderId = item.order.toString();
      if (!itemsByOrder.has(orderId)) {
        itemsByOrder.set(orderId, []);
      }
      const productId = item.product?._id?.toString();
      itemsByOrder.get(orderId).push({
        _id: item._id,
        product: {
          ...item.product,
          images: productId ? imageMap.get(productId) || [] : [],
        },
        quantity: item.quantity,
        price: item.price,
      });
    });

    const response = orders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order._id.toString()) || [],
    }));

    res.status(200).json({ orders: response });
  } catch (error) {
    next(error);
  }
};
