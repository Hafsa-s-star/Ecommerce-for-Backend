import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setCategory } from '../redux/productsSlice';
import { toggleCart } from '../redux/cartSlice';
import { ShoppingBasket, Search, Leaf } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { searchQuery, selectedCategory } = useSelector(state => state.products);

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Pantry'];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/95 backdrop-blur-md border-b border-emerald-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => dispatch(setCategory('All'))}
          >
            <div className="p-2 bg-emerald-500 rounded-2xl text-emerald-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 fill-emerald-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-400">
                Fresh<span className="text-amber-400">Market</span>
              </span>
              <span className="block text-[10px] text-emerald-300 font-medium tracking-widest uppercase -mt-1">
                100% Organic & Local
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search fresh groceries, fruits, milk..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-emerald-950/60 border border-emerald-700/60 rounded-full text-sm text-emerald-100 placeholder-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-emerald-950 transition"
              />
            </div>
          </div>

          {/* Cart Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative flex items-center gap-2.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBasket className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-emerald-950 text-amber-400 text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-emerald-800/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setCategory(cat))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-bold'
                  : 'bg-emerald-800/50 text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
