import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Electronics', 'Fashion', 'Shoes', 'Accessories', 'Beauty', 'Home']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price']
    },
    originalPrice: {
      type: Number
    },
    discountedPrice: {
      type: Number
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      required: [true, 'Please add a main product image URL']
    },
    secondaryImage: {
      type: String
    },
    stock: {
      type: Number,
      default: 50,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    specs: [{
      type: String
    }],
    colors: [{
      type: String
    }],
    badge: {
      type: String
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Virtual field for discountedPrice / price fallback
productSchema.pre('save', function (next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  if (!this.discountedPrice) {
    this.discountedPrice = this.discountPercentage > 0 
      ? Math.round(this.price * (1 - this.discountPercentage / 100))
      : this.price;
  }
  this.inStock = this.stock > 0;
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
