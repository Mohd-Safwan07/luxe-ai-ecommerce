import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, totalAmount, paymentStatus } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    const resolveProductsParallel = async (items) => {
      let computedTotal = 0;
      const sanitized = await Promise.all(
        items.map(async (item) => {
          const rawId = item.product || item.id;
          let dbProduct = null;

          if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
            dbProduct = await Product.findById(rawId).lean();
          }
          if (!dbProduct && item.name) {
            dbProduct = await Product.findOne({ name: item.name }).lean();
            if (!dbProduct) {
              const searchKeyword = item.name.split(' ')[0];
              dbProduct = await Product.findOne({ name: { $regex: searchKeyword, $options: 'i' } }).lean();
            }
          }

          const itemPrice = dbProduct
            ? (dbProduct.discountedPrice !== undefined ? dbProduct.discountedPrice : dbProduct.price)
            : (item.price || 0);

          const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
          computedTotal += itemPrice * qty;

          const finalProductId = dbProduct
            ? dbProduct._id
            : (rawId && mongoose.Types.ObjectId.isValid(rawId) ? rawId : new mongoose.Types.ObjectId());

          return {
            product: finalProductId,
            name: dbProduct ? dbProduct.name : (item.name || 'Product'),
            quantity: qty,
            selectedColor: item.selectedColor || (dbProduct?.colors && dbProduct.colors[0]) || '',
            price: itemPrice,
            image: dbProduct ? dbProduct.image : (item.image || '')
          };
        })
      );
      return { sanitizedProducts: sanitized, computedTotal };
    };

    const { sanitizedProducts, computedTotal } = await resolveProductsParallel(products);

    const order = new Order({
      user: req.user._id,
      products: sanitizedProducts,
      shippingAddress,
      totalAmount: totalAmount !== undefined ? totalAmount : computedTotal,
      paymentStatus: paymentStatus || 'Cash on Delivery',
      orderStatus: 'Pending'
    });

    const createdOrder = await order.save();

    // Clear cart after order placement
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};
