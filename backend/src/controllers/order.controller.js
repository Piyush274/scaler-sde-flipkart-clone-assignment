import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

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
