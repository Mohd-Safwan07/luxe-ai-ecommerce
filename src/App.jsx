import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TrendingProducts } from './components/TrendingProducts';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { AdminLayout } from './components/admin/AdminLayout';
import { LuxeAIButton } from './components/ai/LuxeAIButton';
import { LuxeAIDrawer } from './components/ai/LuxeAIDrawer';

function AppContent() {
  const { user, addToast } = useShop();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Synchronize view state with window.location.pathname
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'shop';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('shop');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (viewOrSection) => {
    if (viewOrSection === 'admin') {
      if (!user) {
        addToast('Please login with an admin account', 'warning');
        return;
      }
      if (user.role !== 'admin') {
        addToast('Unauthorized: Admin role required to access /admin', 'error');
        return;
      }
      setCurrentView('admin');
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      setCurrentView('shop');
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      setTimeout(() => {
        const element = document.getElementById(viewOrSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleOpenCheckout = (total) => {
    setCheckoutTotal(total);
    setCheckoutModalOpen(true);
  };

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <ToastContainer />
        <AdminLayout onReturnToShop={() => navigateTo('shop')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Alert Popups */}
      <ToastContainer />

      {/* Main Header / Navbar */}
      <Navbar onNavigate={navigateTo} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* 1. Hero / Banner */}
        <section id="hero">
          <Hero onExploreClick={() => navigateTo('shop')} />
        </section>

        {/* 2. Categories Section */}
        <section id="categories">
          <Categories onCategorySelect={() => navigateTo('shop')} />
        </section>

        {/* 3. Featured Products Grid & Filters */}
        <FeaturedProducts />

        {/* 4. Flash Sale Discount Banner */}
        <FlashSaleBanner onShopNow={() => navigateTo('shop')} />

        {/* 5. Trending Products */}
        <TrendingProducts />

        {/* 6. Why Choose Us / Trust Badges */}
        <section id="why">
          <WhyChooseUs />
        </section>

      </main>

      {/* Slide-over Drawers & Modals */}
      <CartDrawer onCheckout={handleOpenCheckout} />
      <WishlistDrawer />
      <QuickViewModal />
      <AuthModal />
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        totalAmount={checkoutTotal}
      />

      {/* Luxe AI Copilot Floating Button & Drawer */}
      <LuxeAIButton onClick={() => setAiDrawerOpen(true)} />
      <LuxeAIDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
