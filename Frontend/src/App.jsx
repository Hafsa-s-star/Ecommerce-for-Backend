import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import { api, clearSession, storeSession } from './authStorage';
import { ShoppingBasket, Truck, Award, RefreshCw, Leaf, MapPin, Clock3 } from 'lucide-react';
import { setCategory, setProducts, mapProduct } from './redux/productsSlice';
import { clearCart, mapCartItems, setCartItems } from './redux/cartSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { items, selectedCategory, searchQuery } = useSelector((state) => state.products);
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authError, setAuthError] = useState('');
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    api.get('/auth/me')
      .then(({ data }) => {
        if (isCurrent) setUser(storeSession(data.user));
      })
      .catch((error) => {
        clearSession();
        if (error.response?.status !== 401) {
          console.error('Unable to verify the FreshMarket session.', error);
          if (isCurrent) setAuthError('Could not connect to the account service. Check that the backend is running.');
        }
      })
      .finally(() => {
        if (isCurrent) setIsCheckingSession(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let isCurrent = true;
    const loadStoreData = async () => {
      try {
        const { data } = await api.get('/product/');
        if (isCurrent) dispatch(setProducts((data.products || []).map(mapProduct)));
        setCatalogError('');
      } catch (error) {
        console.error('Unable to load FreshMarket products.', error);
        if (isCurrent) setCatalogError(error.response?.data?.message || 'Products could not be loaded from the store.');
      }
      if (user.role === 'user') {
        try {
          const { data } = await api.get('/cart/');
          if (isCurrent) dispatch(setCartItems(mapCartItems(data.cart)));
        } catch (error) {
          console.error('Unable to load the FreshMarket cart.', error);
          if (isCurrent) setCatalogError(error.response?.data?.message || 'Your cart could not be loaded.');
        }
      }
    };
    loadStoreData();
    return () => {
      isCurrent = false;
    };
  }, [user, dispatch]);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
      clearSession();
      dispatch(clearCart());
      dispatch(setProducts([]));
      setUser(null);
      setAuthError('');
    } catch (error) {
      console.error('Unable to sign out of FreshMarket.', error);
      window.alert(error.response?.data?.message || 'Could not sign out. Please try again.');
    }
  };

  if (isCheckingSession) {
    return <div className="min-h-screen grid place-items-center bg-emerald-50 text-emerald-900 font-semibold">Connecting to FreshMarket…</div>;
  }

  if (!user) {
    return <AuthScreen initialError={authError} onAuthenticated={(account) => { setAuthError(''); setUser(account); }} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onSignOut={handleSignOut} />;
  }

  const filteredProducts = items.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col font-sans text-gray-800">
      <Navbar user={user} onSignOut={handleSignOut} />
      {catalogError && <div role="alert" className="mx-auto mt-4 w-[calc(100%-2rem)] max-w-7xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{catalogError}</div>}

      <section className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full uppercase tracking-wider">
              Fresh Harvest Daily
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
              {selectedCategory === 'All' ? 'All Organic Products' : selectedCategory}
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

      <CartDrawer />

      <footer className="store-footer bg-emerald-950 text-emerald-100 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="footer-brand">
              <div className="flex items-center gap-2.5">
                <span className="footer-brand-mark"><Leaf className="w-5 h-5" /></span>
                <span className="text-lg font-black tracking-tight text-white">Fresh<span className="text-amber-400">Market</span></span>
              </div>
              <p>Everyday goodness, picked fresh and brought a little closer to home.</p>
            </div>
            <div className="footer-shop">
              <h3>Shop fresh</h3>
              {['Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Pantry'].map((category) => (
                <button key={category} onClick={() => {
                  dispatch(setCategory(category));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>{category}</button>
              ))}
            </div>
            <div className="footer-promise">
              <h3>Our promise</h3>
              <div><Leaf size={17} /><span>Seasonal picks from local growers</span></div>
              <div><Truck size={17} /><span>Carefully packed for your doorstep</span></div>
              <div><Award size={17} /><span>Quality you can feel good about</span></div>
            </div>
            <div className="footer-hours">
              <h3>Here for you</h3>
              <div><Clock3 size={17} /><span>Fresh finds, all day long</span></div>
              <div><MapPin size={17} /><span>Rooted in local goodness</span></div>
              <p>Browse the collection and build a basket that feels just right.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} FreshMarket</span>
            <span>Good food starts with good growers.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
