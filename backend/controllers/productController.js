import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, sorting, and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, q, sortBy, minRating, maxPrice } = req.query;

    const queryObj = {};

    if (category && category !== 'all') {
      queryObj.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (q) {
      queryObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    if (minRating) {
      queryObj.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      queryObj.discountedPrice = { $lte: Number(maxPrice) };
    }

    let query = Product.find(queryObj);

    // Sorting options
    if (sortBy === 'price-asc') {
      query = query.sort({ discountedPrice: 1 });
    } else if (sortBy === 'price-desc') {
      query = query.sort({ discountedPrice: -1 });
    } else if (sortBy === 'rating') {
      query = query.sort({ rating: -1 });
    } else if (sortBy === 'discount') {
      query = query.sort({ discountPercentage: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Search products by query string
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      discountPercentage,
      rating,
      reviewCount,
      image,
      secondaryImage,
      stock,
      specs,
      colors,
      badge,
      isFeatured,
      isTrending
    } = req.body;

    const product = new Product({
      name: name || 'Sample Product Name',
      price: price || 99,
      originalPrice: originalPrice || price || 99,
      description: description || 'Sample product description',
      category: category || 'Electronics',
      discountPercentage: discountPercentage || 0,
      rating: rating || 4.5,
      reviewCount: reviewCount || 0,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      secondaryImage: secondaryImage || '',
      stock: stock !== undefined ? stock : 50,
      specs: specs || [],
      colors: colors || [],
      badge: badge || 'New',
      isFeatured: isFeatured || false,
      isTrending: isTrending || false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};
