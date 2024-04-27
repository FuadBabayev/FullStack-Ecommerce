import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import productReducer from "../slices/products/productSlice";
import categoryReducer from "../slices/categories/categorySlice";
import brandReducer from "../slices/brands/brandSlice";
import colorReducer from "../slices/colors/colorSlice";
import cartReducer from "../slices/cart/cartSlice";
import couponReducer from "../slices/coupons/couponSlice";
import orderReducer from "../slices/orders/orderSlice";
import reviewReducer from "../slices/reviews/reviewSlice";

// Store
const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productReducer,
        categories: categoryReducer,
        brands: brandReducer,
        colors: colorReducer,
        carts: cartReducer,
        coupons: couponReducer,
        orders: orderReducer,
        reviews: reviewReducer
    },
});
export default store;