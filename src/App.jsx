import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import { ShoppingBasket, Truck, Award, RefreshCw } from 'lucide-react';

function App() {
  const { items, selectedCategory, searchQuery } = useSelector((state) => state.products);

  const filteredProducts = items.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col font-sans text-gray-800">
      <Navbar />

      {/* Fresh Grocery Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full uppercase tracking-wider">
              🌿 Fresh Harvest Daily
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Organic Groceries <br className="hidden sm:inline" />
              Delivered To Your Door
            </h1>
            <p className="text-emerald-200 max-w-lg text-xs sm:text-sm leading-relaxed">
              Farm-fresh fruits, crisp vegetables, and artisanal dairy sourced from certified local growers.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <Truck className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <span className="block text-xs font-bold text-white">Same-Day</span>
              <span className="text-[10px] text-emerald-200">Delivery</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <Award className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <span className="block text-xs font-bold text-white">100% Organic</span>
              <span className="text-[10px] text-emerald-200">Certified</span>
            </div>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <RefreshCw className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <span className="block text-xs font-bold text-white">Guaranteed</span>
              <span className="text-[10px] text-emerald-200">Freshness</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grocery Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
              {selectedCategory === 'All' ? 'All Organic Products' : `${selectedCategory}`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length} fresh item{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-white rounded-3xl border border-emerald-100 p-8 shadow-xs">
            <ShoppingBasket className="w-12 h-12 mx-auto stroke-1 text-emerald-400 mb-3" />
            <p className="text-lg font-bold text-emerald-950">No items match your search</p>
            <p className="text-xs text-gray-400 mt-1">Try selecting another category or clearing your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300/80 border-t border-emerald-900 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs space-y-1">
          <p className="font-semibold text-emerald-200">FreshMarket Organic Grocery Store</p>
          <p className="text-[11px] text-emerald-400/60">Built with React 19, Redux Toolkit, Pixabay Images & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
