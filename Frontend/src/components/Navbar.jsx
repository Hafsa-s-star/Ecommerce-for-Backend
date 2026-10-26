import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setCategory } from '../redux/productsSlice';
import { toggleCart } from '../redux/cartSlice';
import { ShoppingBasket, Search, Leaf, LogOut, UserRound } from 'lucide-react';

const Navbar = ({ user, onSignOut }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { searchQuery, selectedCategory } = useSelector(state => state.products);

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Pantry'];

  return (
    <header className="store-navbar sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            type="button"
            className="flex items-center gap-2.5 cursor-pointer group text-left bg-transparent border-0 p-0"
            onClick={() => dispatch(setCategory('All'))}
            aria-label="FreshMarket home"
          >
            <div className="p-2.5 bg-emerald-400 rounded-2xl text-emerald-950 shadow-lg shadow-emerald-500/20 group-hover:rotate-[-5deg] group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-emerald-950" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                Fresh<span className="text-amber-400">Market</span>
              </span>
              <span className="block text-[9px] text-emerald-300 font-semibold tracking-[0.15em] uppercase -mt-0.5">
                Fresh from local farms
              </span>
            </div>
          </button>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                aria-label="Search products"
                placeholder="Search fresh groceries..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-sm text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-emerald-900 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline-flex items-center gap-2 text-xs text-emerald-100">
              <UserRound className="w-4 h-4 text-emerald-300" />
              Hi, {user.name.split(' ')[0]}
            </span>
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition"
              aria-label={`Shopping cart, ${totalCartCount} items`}
            >
              <ShoppingBasket className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span aria-live="polite" className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold min-w-5 h-5 px-1 rounded-full inline-flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 text-emerald-200 hover:text-white text-xs font-semibold rounded-full hover:bg-white/10 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        <div className="store-mobile-search flex relative pb-2.5 md:hidden">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search fresh groceries..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-emerald-900 transition"
          />
        </div>

        <nav className="store-categories flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-white/10" aria-label="Product categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setCategory(cat))}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-bold'
                  : 'bg-white/5 text-emerald-100 hover:bg-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
