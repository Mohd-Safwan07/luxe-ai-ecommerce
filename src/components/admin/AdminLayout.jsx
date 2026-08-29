import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowLeft, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = ({ onReturnToShop }) => {
  const { user, logout, addToast } = useShop();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'users'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Frontend Authorization Check: Require user with role === 'admin'
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 mt-2">
              You must be logged in with an administrator account to view the Admin Control Panel.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                if (onReturnToShop) onReturnToShop();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users Directory', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
            LX
          </div>
          <span className="font-extrabold text-sm tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="space-y-8">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-500/20">
              LX
            </div>
            <div>
              <span className="font-black text-white text-lg leading-none block tracking-tight">
                Luxe<span className="text-indigo-400">Admin</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Management Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          
          <button
            onClick={() => {
              if (onReturnToShop) onReturnToShop();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Return to Customer Site</span>
          </button>

          <button
            onClick={() => {
              logout();
              if (onReturnToShop) onReturnToShop();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>

        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-200/80">
              Admin Protected Zone
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200/80">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <span className="font-extrabold text-xs text-slate-900 block leading-tight">{user.name}</span>
                <span className="text-[10px] font-semibold text-purple-600 block leading-none">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onReturnToShop) onReturnToShop();
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </button>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'users' && <AdminUsers />}
        </div>

      </main>

    </div>
  );
};
