import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, setCartOpen, clearCart } from '../redux/cartSlice';
import { X, Trash2, Plus, Minus, ShoppingBasket, ArrowRight, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-emerald-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setCartOpen(false))}
      />

      {/* Cart Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBasket className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Your Fresh Basket</h2>
          </div>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            className="p-1.5 text-emerald-200 hover:text-white rounded-full hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-emerald-50/20">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <div className="p-4 bg-emerald-100/60 rounded-full text-emerald-700">
                <ShoppingBasket className="w-12 h-12 stroke-1" />
              </div>
              <p className="text-base font-semibold text-gray-700">Your grocery basket is empty.</p>
              <p className="text-xs text-gray-400 max-w-xs">Add fresh fruits, veggies, or organic dairy to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl bg-emerald-50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    ${item.price.toFixed(2)} / <span className="text-gray-400 font-normal">{item.unit}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                      }
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-800 px-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                      }
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end justify-between self-stretch">
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-emerald-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-emerald-100 bg-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Estimated Subtotal</span>
              <span className="font-black text-emerald-950 text-xl">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Free eco-friendly express delivery on orders over $25</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="py-3 px-4 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 rounded-2xl text-xs font-bold transition"
              >
                Clear
              </button>
              <button
                onClick={() => Swal.fire({
                  title: 'Done!',
                  text: 'Grocery Order Placed Sucessfully',
                  icon: 'success',
                  confirmButtonText: 'Cool',
                  confirmButtonColor: '#064e3b'
                })}
                className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-amber-400 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
