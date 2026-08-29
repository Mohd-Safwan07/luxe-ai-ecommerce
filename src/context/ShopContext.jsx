import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiFetch, fetchProductsFromAPI } from '../services/api';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(150000);
  const [sortBy, setSortBy] = useState('featured');
  const [minRating, setMinRating] = useState(0);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  // Toast manager
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch live products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError(null);
        const data = await fetchProductsFromAPI();
        if (Array.isArray(data)) {
          // Normalize MongoDB product _id to id for seamless UI compatibility
          const normalized = data.map((p) => ({
            ...p,
            id: p._id || p.id,
            name: p.name || '',
            description: p.description || '',
            price: p.discountedPrice !== undefined ? p.discountedPrice : (p.price || p.originalPrice || 0),
            originalPrice: p.originalPrice || p.price || 0,
            discountedPrice: p.discountedPrice !== undefined ? p.discountedPrice : (p.price || p.originalPrice || 0),
            discountPercentage: p.discountPercentage !== undefined ? p.discountPercentage : 0,
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 0,
            image: p.image || '',
            secondaryImage: p.secondaryImage || p.image || '',
            category: p.category || 'General',
            badge: p.badge || '',
            colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#ffffff'],
            inStock: p.inStock !== undefined ? p.inStock : (p.stock > 0)
          }));
          setProducts(normalized);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch products from backend API:', err.message);
        setProductsError('Unable to connect to product server. Please verify the backend is running.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch logged in user profile & wishlist on load
  useEffect(() => {
    if (token) {
      apiFetch('/auth/me')
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setWishlist([]);
        });

      apiFetch('/wishlist')
        .then((wishlistData) => {
          if (wishlistData && Array.isArray(wishlistData.products)) {
            const ids = wishlistData.products.map((p) => p._id || p.id || p);
            setWishlist(Array.from(new Set(ids)));
          }
        })
        .catch(() => {
          console.log('Using local wishlist state');
        });
    } else {
      setWishlist([]);
    }
  }, [token]);

  // Auth actions
  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      addToast(`Welcome back, ${data.name}!`, 'success');
      setIsAuthModalOpen(false);
      return data;
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      addToast(`Account created successfully! Welcome ${data.name}.`, 'success');
      setIsAuthModalOpen(false);
      return data;
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setWishlist([]);
    addToast('Logged out successfully', 'info');
  };

  // Cart actions
  const addToCart = async (product, quantity = 1, selectedColor = null) => {
    const targetColor = selectedColor || (product.colors && product.colors[0]) || '#000000';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item.product.id === product.id || item.product._id === product._id) && item.selectedColor === targetColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          { product, quantity, selectedColor: targetColor }
        ];
      }
    });

    addToast(`Added "${product.name.slice(0, 24)}..." to cart!`);

    // Sync with backend if logged in
    if (token && product._id) {
      try {
        await apiFetch('/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product._id, quantity, selectedColor: targetColor })
        });
      } catch (err) {
        console.error('Failed to sync cart item with backend');
      }
    }
  };

  const removeFromCart = async (productId, color) => {
    setCart((prev) => prev.filter((item) => !( (item.product.id === productId || item.product._id === productId) && item.selectedColor === color)));
    addToast('Item removed from cart', 'info');

    if (token) {
      try {
        await apiFetch(`/cart/${productId}?selectedColor=${encodeURIComponent(color || '')}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Failed to remove cart item from backend');
      }
    }
  };

  const updateCartQuantity = async (productId, color, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.product.id === productId || item.product._id === productId) && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );

    if (token) {
      const item = cart.find(
        (i) => (i.product.id === productId || i.product._id === productId) && i.selectedColor === color
      );
      if (item) {
        const newQty = item.quantity + delta;
        try {
          await apiFetch(`/cart/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQty, selectedColor: color })
          });
        } catch (err) {
          console.error('Failed to update cart quantity on backend');
        }
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    addToast('Cart cleared', 'info');

    if (token) {
      try {
        await apiFetch('/cart', { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to clear cart on backend');
      }
    }
  };

  // Wishlist actions
  const toggleWishlist = async (product) => {
    const targetId = product._id || product.id;
    const exists = wishlist.some((id) => id === targetId || id === product._id || id === product.id);

    setWishlist((prev) => {
      if (exists) {
        addToast(`Removed from Wishlist`, 'info');
        return prev.filter((id) => id !== targetId && id !== product._id && id !== product.id);
      } else {
        addToast(`Saved to Wishlist!`);
        return Array.from(new Set([...prev, targetId]));
      }
    });

    if (token && product._id) {
      try {
        if (exists) {
          await apiFetch(`/wishlist/${product._id}`, { method: 'DELETE' });
        } else {
          await apiFetch(`/wishlist/${product._id}`, { method: 'POST' });
        }
      } catch (err) {
        console.error('Failed to sync wishlist with backend');
      }
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((id) => id === productId);

  // Quick view modal
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();

      const priceToCompare = product.discountedPrice !== undefined ? product.discountedPrice : product.price;
      const matchesPrice = priceToCompare <= priceRange;
      const matchesRating = (product.rating || 4.5) >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    }).sort((a, b) => {
      const priceA = a.discountedPrice !== undefined ? a.discountedPrice : a.price;
      const priceB = b.discountedPrice !== undefined ? b.discountedPrice : b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, minRating]);

  // Totals calculation
  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const itemPrice = item.product.discountedPrice !== undefined ? item.product.discountedPrice : item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const wishlistTotalItems = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  return (
    <ShopContext.Provider
      value={{
        products,
        loadingProducts,
        productsError,
        filteredProducts,
        cart,
        wishlist,
        user,
        token,
        login,
        register,
        logout,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        minRating,
        setMinRating,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isQuickViewOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartSubtotal,
        cartTotalItems,
        wishlistTotalItems,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
