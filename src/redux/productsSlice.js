import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
  {
    id: 1,
    title: 'Fresh Organic Red Apples',
    price: 3.99,
    unit: '1 kg',
    category: 'Fruits',
    rating: 4.9,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh6nuz-yK7Q9RTU2z7i3mIUSD0e9O-56f5f0gp0F7JEzKAHVEa5UzGXpfcsjLaagDkXzLuqeTgf97ECRmoYNtNttKY7rdAHSsZX4vmh16dEw&s=10',
    description: 'Crisp, sweet, and juicy red apples sourced directly from local organic orchards.'
  },
  {
    id: 2,
    title: 'Farm Fresh Organic Bananas',
    price: 1.99,
    unit: '1 bunch',
    category: 'Fruits',
    rating: 4.8,
    image: 'https://cdn.pixabay.com/photo/2018/09/24/20/12/bananas-3700718_1280.jpg',
    description: 'Rich in potassium and natural energy, perfect for daily snacks and smoothies.'
  },
  {
    id: 3,
    title: 'Fresh Green Broccoli Heads',
    price: 2.49,
    unit: '500g',
    category: 'Vegetables',
    rating: 4.7,
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/broccoli-1238250_1280.jpg',
    description: 'Packed with vitamins and antioxidants, freshly harvested green broccoli.'
  },
  {
    id: 4,
    title: 'Organic Carrots with Tops',
    price: 2.19,
    unit: '1 kg',
    category: 'Vegetables',
    rating: 4.6,
    image: 'https://media.istockphoto.com/id/1388403435/photo/fresh-carrots-isolated-on-white-background.jpg?s=1024x1024&w=is&k=20&c=AZlR713OB95BftaWVrKHOLKcbX1VYSWBHfGs1C6_nj8=',
    description: 'Naturally sweet and crunchy orange carrots ideal for salads, cooking, and juices.'
  },
  {
    id: 5,
    title: 'Pure Whole Farm Milk',
    price: 3.49,
    unit: '1 Liter',
    category: 'Dairy & Eggs',
    rating: 4.9,
    image: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg',
    description: 'Pasteurized whole milk enriched with natural calcium and vitamin D.'
  },
  {
    id: 6,
    title: 'Farm Free-Range Brown Eggs',
    price: 4.29,
    unit: '12 pcs',
    category: 'Dairy & Eggs',
    rating: 4.9,
    image: 'https://cdn.pixabay.com/photo/2016/11/29/05/07/bread-1867459_1280.jpg',
    description: 'Nutritious eggs from free-range hens fed on high quality organic grains.'
  },
  {
    id: 7,
    title: 'Freshly Baked Whole Wheat Bread',
    price: 2.99,
    unit: '400g',
    category: 'Bakery',
    rating: 4.8,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRguRwFJ6luarP8pjZG6pZ0bZ9xkNWDBqJENJp2fmRcYCoTJRlY5quMT2f677SHliAg8dS8EQ_O8GGr6UHEXWsm-yrC3zCHbvxJrTIy61U05A&s=10',
    description: 'Artisanal whole grain bread baked daily with zero artificial preservatives.'
  },
  {
    id: 8,
    title: 'Cold-Pressed Extra Virgin Olive Oil',
    price: 11.99,
    unit: '500ml',
    category: 'Pantry',
    rating: 4.9,
    image: 'https://cdn.pixabay.com/photo/2015/10/02/15/59/olive-oil-968657_1280.jpg',
    description: 'Premium Mediterranean extra virgin olive oil perfect for dressing and healthy cooking.'
  }
];

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
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
  },
});

export const { setCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
