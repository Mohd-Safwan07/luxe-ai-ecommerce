import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Percent,
  ShieldCheck
} from 'lucide-react';

export const Navbar = ({ onNavigate }) => {
  const {
    searchQuery,
    setSearchQuery,
    cartTotalItems,
    wishlistTotalItems,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthModalOpen,
    selectedCategory,
    setSelectedCategory,
    user,
    logout
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center flex items-center justify-between font-medium">
        <div className="hidden md:flex items-center gap-2 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>New Summer Collection 2026 is live!</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">FREE SHIPPING</span>
          <span>Orders over ₹1,499 get free 2-day delivery across India</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-slate-400">
          <a href="#deals" onClick={() => handleNavClick('deals')} className="hover:text-white transition-colors flex items-center gap-1">
            <Percent className="w-3 h-3 text-rose-400" /> Deals & Offers
          </a>
          <span>|</span>
          <span>24/7 Support</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                  Luxe<span className="text-indigo-600">Store</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Shop Smart, Live Better
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button 
                onClick={() => handleNavClick('hero')}
                className="hover:text-indigo-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('shop')}
                className="hover:text-indigo-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all"
              >
                Shop
              </button>
              <button 
                onClick={() => handleNavClick('categories')}
                className="hover:text-indigo-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all"
              >
                Categories
              </button>
              <button 
                onClick={() => handleNavClick('trending')}
                className="hover:text-indigo-600 transition-colors py-1 relative flex items-center gap-1 text-slate-700 font-semibold"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Trending
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block relative">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.01]' : ''}`}>
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-slate-100/80 focus:bg-white pl-10 pr-10 py-2.5 rounded-full text-sm border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons & Login */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistTotalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistTotalItems}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-full font-medium text-sm transition-all"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">Cart</span>
            </button>

            {/* Login / User Profile Button */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-100 pl-10 pr-8 py-2 rounded-full text-sm border border-slate-200 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2 text-base font-medium">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              Home <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              Shop All <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              Categories <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNavClick('trending')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-800"
            >
              Trending Products <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </nav>
          
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('admin');
                }}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Open Admin Panel
              </button>
            )}
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-rose-600 py-2.5 rounded-xl font-medium text-xs"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium text-xs"
              >
                <User className="w-4 h-4" /> Account / Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
