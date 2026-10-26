import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, mapProduct, updateProduct } from '../redux/productsSlice';
import { api } from '../authStorage';
import {
  LayoutDashboard, Package, Users, Plus, Search, Leaf, LogOut, Pencil, Trash2,
  X, ShoppingBasket, Sprout, ChevronRight,
} from 'lucide-react';

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Pantry'];

const emptyProduct = {
  title: '',
  price: '',
  unit: '',
  category: 'Fruits',
  rating: '4.8',
  imageFile: null,
  currentImage: '',
  description: '',
};

function AdminDashboard({ user, onSignOut }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [activeTab, setActiveTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    api.get('/auth/users')
      .then(({ data }) => {
        if (isCurrent) {
          setUsers((data.users || []).map((account) => ({
            id: account._id ?? account.id,
            name: account.username ?? account.name,
            email: account.email,
            role: account.role,
            createdAt: account.createdAt,
          })));
          setUsersError('');
        }
      })
      .catch((error) => {
        console.error('Unable to load FreshMarket user accounts.', error);
        if (isCurrent) setUsersError(error.response?.data?.message || 'User accounts could not be loaded.');
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const customers = users.filter((account) => account.role !== 'admin');
  const visibleProducts = useMemo(() => products.filter((product) => (
    `${product.title} ${product.category}`.toLowerCase().includes(query.toLowerCase())
  )), [products, query]);
  const visibleUsers = useMemo(() => users.filter((account) => (
    `${account.name} ${account.email} ${account.role}`.toLowerCase().includes(query.toLowerCase())
  )), [users, query]);

  const openProductForm = (product = null) => {
    setForm(product
      ? { ...product, price: product.price == null ? '' : String(product.price), rating: String(product.rating), imageFile: null, currentImage: product.image }
      : { ...emptyProduct });
    setModal({ type: 'product', id: product?.id ?? null });
    setFormError('');
  };

  const openUserForm = (account = null) => {
    setForm(account ? { ...account, password: '' } : { name: '', email: '', role: 'user', password: '' });
    setModal({ type: 'user', id: account?.id ?? null });
    setFormError('');
  };

  const closeModal = () => {
    setModal(null);
    setFormError('');
  };

  const saveForm = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      if (modal.type === 'product') {
        const price = Number(form.price);
        const rating = Number(form.rating);
        if (!form.title.trim() || !form.description.trim() || !form.unit.trim() || (!modal.id && !form.imageFile) ||
            !Number.isFinite(price) || price <= 0 || !Number.isFinite(rating) || rating < 0 || rating > 5) {
          setFormError('Please complete every field with a valid price and rating.');
          return;
        }
        const productPayload = new FormData();
        productPayload.append('name', form.title.trim());
        productPayload.append('desc', form.description.trim());
        productPayload.append('price', String(price));
        productPayload.append('category', form.category);
        productPayload.append('unit', form.unit.trim());
        productPayload.append('rating', String(rating));
        if (form.imageFile) productPayload.append('image', form.imageFile);
        const { data } = modal.id
          ? await api.patch(`/product/${modal.id}`, productPayload)
          : await api.post('/product/create', productPayload);
        const product = mapProduct(data.product);
        if (modal.id) dispatch(updateProduct(product));
        else dispatch(addProduct(product));
        closeModal();
        return;
      }

      const normalizedEmail = form.email.trim().toLowerCase();
      if (!form.name.trim() || !normalizedEmail || (!modal.id && form.password.length < 8)) {
        setFormError('Enter a name and email. New accounts need a password of at least 8 characters.');
        return;
      }
      if (users.some((account) => account.email === normalizedEmail && account.id !== modal.id)) {
        setFormError('That email address is already in use.');
        return;
      }
      const userPayload = {
        username: form.name.trim(),
        email: normalizedEmail,
        role: form.role,
      };
      let savedUser;
      if (modal.id) {
        const { data } = await api.patch(`/auth/users/${modal.id}`, userPayload);
        savedUser = data.user;
      } else {
        const { data } = await api.post('/auth/users', { ...userPayload, password: form.password });
        savedUser = data.user;
      }
      const account = {
        id: savedUser._id ?? savedUser.id,
        name: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      };
      setUsers((existing) => modal.id
        ? existing.map((entry) => entry.id === modal.id ? account : entry)
        : [...existing, account]);
      closeModal();
    } catch (error) {
      console.error('Unable to save FreshMarket admin changes.', error);
      setFormError(error.response?.data?.message || 'We could not save your changes. Please try again.');
    }
  };

  const removeUser = async (account) => {
    if (account.id === user.id) return;
    if (!window.confirm(`Delete the account for ${account.name}?`)) return;
    try {
      await api.delete(`/auth/users/${account.id}`);
      setUsers((existing) => existing.filter((entry) => entry.id !== account.id));
    } catch (error) {
      console.error('Unable to delete FreshMarket user.', error);
      window.alert(error.response?.data?.message || 'Could not delete the user.');
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete ${product.title} from the catalog?`)) return;
    try {
      await api.delete(`/product/${product.id}`);
      dispatch(deleteProduct(product.id));
    } catch (error) {
      console.error('Unable to delete FreshMarket product.', error);
      window.alert(error.response?.data?.message || 'Could not delete the product.');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="auth-brand-mark"><Leaf size={21} /></span>
          <span>Fresh<span>Market</span></span>
        </a>
        <span className="admin-sidebar-label">WORKSPACE</span>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => { setActiveTab(id); setQuery(''); }}>
              <Icon size={18} /> {label}
              {activeTab === id && <ChevronRight className="nav-chevron" size={16} />}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user-chip">
            <div className="admin-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div><strong>{user.name}</strong><span>Administrator</span></div>
          </div>
          <button className="admin-signout" onClick={onSignOut}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>FreshMarket</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === activeTab)?.label}</strong></div>
          <span className="admin-demo-label"><span /> Connected to store</span>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <>
              <div className="admin-page-heading">
                <div><span className="admin-eyebrow">YOUR STORE AT A GLANCE</span><h1>Good day, {user.name.split(' ')[0]}</h1><p>Manage your fresh market from one simple workspace.</p></div>
                <button className="admin-primary-button" onClick={() => openProductForm()}><Plus size={17} /> Add product</button>
              </div>
              <div className="admin-stat-grid">
                <div className="admin-stat-card"><span className="stat-icon green"><Package size={19} /></span><span className="stat-label">Products in catalog</span><strong>{products.length}</strong><span className="stat-caption">Fresh products available</span></div>
                <div className="admin-stat-card"><span className="stat-icon amber"><Users size={19} /></span><span className="stat-label">Registered accounts</span><strong>{customers.length}</strong><span className="stat-caption">Customer accounts</span></div>
                <div className="admin-stat-card"><span className="stat-icon mint"><Sprout size={19} /></span><span className="stat-label">Product categories</span><strong>{new Set(products.map((product) => product.category)).size}</strong><span className="stat-caption">Across your storefront</span></div>
              </div>
              <section className="admin-panel">
                <div className="admin-panel-heading"><div><h2>Recently added products</h2><p>Your latest additions to the catalog</p></div><button className="admin-text-button" onClick={() => setActiveTab('products')}>Manage products <ChevronRight size={15} /></button></div>
                <div className="admin-product-list">
                  {products.slice(0, 4).map((product) => <div className="admin-product-row" key={product.id}><img src={product.image} alt="" /><div className="admin-product-name"><strong>{product.title}</strong><span>{product.category} · {product.unit}</span></div><strong className="admin-product-price">{Number.isFinite(product.price) ? `$${product.price.toFixed(2)}` : 'Price pending'}</strong><button className="admin-icon-button" aria-label={`Edit ${product.title}`} onClick={() => openProductForm(product)}><Pencil size={16} /></button></div>)}
                  {products.length === 0 && <p className="admin-empty">No products yet. Add your first fresh find to the catalog.</p>}
                </div>
              </section>
            </>
          )}

          {activeTab === 'products' && (
            <>
              <div className="admin-page-heading">
                <div><span className="admin-eyebrow">STORE CATALOG</span><h1>Products</h1><p>Add, edit, and remove products shown in your storefront.</p></div>
                <button className="admin-primary-button" onClick={() => openProductForm()}><Plus size={17} /> Add product</button>
              </div>
              <div className="admin-panel">
                <div className="admin-table-toolbar"><div><h2>All products <span className="admin-count">{products.length}</span></h2><p>Changes appear in the customer storefront.</p></div><label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label></div>
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>RATING</th><th className="actions-heading">ACTIONS</th></tr></thead><tbody>
                  {visibleProducts.map((product) => <tr key={product.id}><td><div className="table-product"><img src={product.image} alt="" /><span><strong>{product.title}</strong><small>{product.unit}</small></span></div></td><td><span className="category-pill">{product.category}</span></td><td className="table-price">{Number.isFinite(product.price) ? `$${product.price.toFixed(2)}` : 'Price pending'}</td><td>{product.rating} / 5</td><td><div className="table-actions"><button aria-label={`Edit ${product.title}`} onClick={() => openProductForm(product)}><Pencil size={16} /></button><button className="delete-action" aria-label={`Delete ${product.title}`} onClick={() => removeProduct(product)}><Trash2 size={16} /></button></div></td></tr>)}
                </tbody></table>{visibleProducts.length === 0 && <p className="admin-empty">No products match your search.</p>}</div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <div className="admin-page-heading">
                <div><span className="admin-eyebrow">ACCOUNT DIRECTORY</span><h1>Users</h1><p>View and manage customer and administrator accounts.</p></div>
                <button className="admin-primary-button" onClick={() => openUserForm()}><Plus size={17} /> Add user</button>
              </div>
              <div className="admin-panel">
                <div className="admin-table-toolbar"><div><h2>All users <span className="admin-count">{visibleUsers.length}</span></h2><p>Manage accounts registered with the store.</p></div><label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" /></label></div>
                {usersError && <p className="admin-form-error px-5 pt-4" role="alert">{usersError}</p>}
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>USER</th><th>ROLE</th><th>JOINED</th><th className="actions-heading">ACTIONS</th></tr></thead><tbody>
                  {visibleUsers.map((account) => <tr key={account.id}><td><div className="table-user"><span className="table-avatar">{account.name.charAt(0).toUpperCase()}</span><span><strong>{account.name}</strong><small>{account.email}</small></span></div></td><td><span className={`role-pill ${account.role}`}>{account.role === 'user' ? 'customer' : account.role}</span></td><td>{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : '—'}</td><td><div className="table-actions">{account.id !== user.id && <><button aria-label={`Edit ${account.name}`} onClick={() => openUserForm(account)}><Pencil size={16} /></button><button className="delete-action" aria-label={`Delete ${account.name}`} onClick={() => removeUser(account)}><Trash2 size={16} /></button></>}</div></td></tr>)}
                </tbody></table>{visibleUsers.length === 0 && <p className="admin-empty">No accounts match your search.</p>}</div>
              </div>
            </>
          )}
        </div>
      </main>

      {modal && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <header><div><span className="admin-eyebrow">{modal.type === 'product' ? 'STORE CATALOG' : 'ACCOUNT DIRECTORY'}</span><h2 id="modal-title">{modal.id ? `Edit ${modal.type}` : `Add ${modal.type}`}</h2></div><button className="admin-icon-button" aria-label="Close" onClick={closeModal}><X size={19} /></button></header>
            <form onSubmit={saveForm}>
              {modal.type === 'product' ? (
                <>
                  <label>Product name<input required value={form.title ?? ''} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Organic strawberries" /></label>
                  <div className="admin-form-grid"><label>Price ($)<input required type="number" min="0.01" step="0.01" value={form.price ?? ''} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label>Unit<input required value={form.unit ?? ''} onChange={(event) => setForm({ ...form, unit: event.target.value })} placeholder="1 kg" /></label></div>
                  <div className="admin-form-grid"><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label>Rating (0–5)<input required type="number" min="0" max="5" step="0.1" value={form.rating ?? ''} onChange={(event) => setForm({ ...form, rating: event.target.value })} /></label></div>
                  {form.currentImage && <img className="admin-image-preview" src={form.currentImage} alt="Current product" />}
                  <label>Product image<input required={!modal.id} type="file" accept="image/*" onChange={(event) => setForm({ ...form, imageFile: event.target.files?.[0] ?? null })} /><small className="admin-field-help">{modal.id ? 'Choose a file only if you want to replace the current image.' : 'Choose an image file for this product.'}</small></label>
                  <label>Description<textarea required rows="3" value={form.description ?? ''} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
                </>
              ) : (
                <>
                  <label>Full name<input required value={form.name ?? ''} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                  <label>Email address<input required type="email" value={form.email ?? ''} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
                  <label>Account role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">Customer</option><option value="admin">Administrator</option></select></label>
                  {!modal.id && <label>Temporary password<input required type="password" minLength="8" value={form.password ?? ''} onChange={(event) => setForm({ ...form, password: event.target.value })} /><small className="admin-field-help">At least 8 characters. The server securely hashes this password.</small></label>}
                </>
              )}
              {formError && <p className="admin-form-error" role="alert">{formError}</p>}
              <footer><button type="button" className="admin-secondary-button" onClick={closeModal}>Cancel</button><button type="submit" className="admin-primary-button">{modal.id ? 'Save changes' : `Add ${modal.type}`}</button></footer>
            </form>
          </section>
        </div>
      )}
      <div className="admin-mobile-brand"><ShoppingBasket size={16} /> FreshMarket Admin</div>
    </div>
  );
}

export default AdminDashboard;
