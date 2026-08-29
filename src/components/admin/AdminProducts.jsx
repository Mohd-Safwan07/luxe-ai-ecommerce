import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { formatINR } from '../../utils/formatters';
import { useShop } from '../../context/ShopContext';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  X,
  Upload,
  Sparkles
} from 'lucide-react';

export const AdminProducts = () => {
  const { addToast } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Product form data
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: 99,
    originalPrice: 99,
    discountPercentage: 0,
    stock: 50,
    description: '',
    image: '',
    badge: 'New',
    isFeatured: false,
    isTrending: false
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Electronics',
      price: 99,
      originalPrice: 99,
      discountPercentage: 0,
      stock: 50,
      description: '',
      image: '',
      badge: 'New',
      isFeatured: false,
      isTrending: false
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'Electronics',
      price: prod.price || 99,
      originalPrice: prod.originalPrice || prod.price || 99,
      discountPercentage: prod.discountPercentage || 0,
      stock: prod.stock !== undefined ? prod.stock : 50,
      description: prod.description || '',
      image: prod.image || '',
      badge: prod.badge || 'New',
      isFeatured: !!prod.isFeatured,
      isTrending: !!prod.isTrending
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const priceNum = Number(formData.price);
    const discountNum = Number(formData.discountPercentage);
    const discountedPrice = discountNum > 0
      ? Math.round(priceNum * (1 - discountNum / 100))
      : priceNum;

    const payload = {
      ...formData,
      price: priceNum,
      originalPrice: Number(formData.originalPrice) || priceNum,
      discountPercentage: discountNum,
      discountedPrice,
      stock: Number(formData.stock),
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    };

    try {
      if (editingProduct) {
        await apiFetch(`/products/${editingProduct._id || editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        addToast('Product updated successfully!', 'success');
        setEditingProduct(null);
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        addToast('New product created successfully!', 'success');
        setIsAddModalOpen(false);
      }
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await apiFetch(`/products/${deletingProduct._id || deletingProduct.id}`, {
        method: 'DELETE'
      });
      addToast(`Product "${deletingProduct.name}" removed`, 'info');
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-xs text-slate-500">Manage catalog products, stock levels, pricing and discounts</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" /> Loading products inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400">Try refining your search terms or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Discount</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id || prod.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Details Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 block max-w-xs truncate">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            ID: {prod._id || prod.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold text-[10px]">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price & Discount */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">
                        {formatINR(prod.discountedPrice !== undefined ? prod.discountedPrice : prod.price)}
                      </div>
                      {prod.discountPercentage > 0 && (
                        <div className="text-[10px] text-rose-500 font-bold">
                          <span className="line-through text-slate-400 mr-1">{formatINR(prod.originalPrice || prod.price)}</span>
                          -{prod.discountPercentage}% OFF
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        (prod.stock || 0) > 10
                          ? 'bg-emerald-100 text-emerald-700'
                          : (prod.stock || 0) > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {(prod.stock || 0) > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating || 4.5}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(prod)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Final Price (₹)</label>
                    <input
                      type="number"
                      disabled
                      value={
                        formData.discountPercentage > 0
                          ? Math.round(formData.originalPrice * (1 - formData.discountPercentage / 100))
                          : formData.originalPrice
                      }
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold text-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-md cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setDeletingProduct(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Confirm Product Deletion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete <strong className="text-slate-800">"{deletingProduct.name}"</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-6 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-2xl hover:bg-rose-700 shadow-md cursor-pointer"
                >
                  Yes, Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
