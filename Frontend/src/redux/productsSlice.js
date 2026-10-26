import { createSlice } from '@reduxjs/toolkit';

export function mapProduct(product) {
  return {
    id: product._id ?? product.id,
    title: product.name ?? product.title,
    description: product.desc ?? product.description ?? '',
    price: product.price == null ? null : Number(product.price),
    unit: product.unit || 'each',
    category: product.category || 'Pantry',
    rating: product.rating == null ? 5 : Number(product.rating),
    image: product.image || '',
  };
}

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedCategory: 'All',
    searchQuery: '',
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((product) => product.id !== action.payload);
    },
  },
});

export const { setCategory, setSearchQuery, setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
