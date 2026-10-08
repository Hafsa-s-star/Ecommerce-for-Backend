import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Star, Plus, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-emerald-50/50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-emerald-900/80 backdrop-blur-md text-emerald-100 text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
            {product.category}
          </span>
        </div>
        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs border border-emerald-100">
          {product.unit}
        </span>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/20">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              In Stock
            </span>
          </div>

          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition text-base leading-snug line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Price</span>
            <span className="text-xl font-black text-emerald-900">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-emerald-900 hover:bg-emerald-800 text-white shadow-emerald-900/10'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-amber-400" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
