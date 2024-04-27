import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction, resetSuccessAction } from "../global/globalActions";

// Initial State
const initialState = {
    loading: false,
    error: null,
    products: [],
    product: {},
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// Create Product Action
export const createProductAction = createAsyncThunk("product/create", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { name, description, category, sizes, brand, colors, price, totalQty, files } = payload;
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };
        // Form Data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("brand", brand);
        formData.append("price", price);
        formData.append("totalQty", totalQty);
        sizes.forEach((size) => formData.append("sizes", size));
        colors.forEach((color) => formData.append("colors", color));
        files.forEach((file) => formData.append("files", file));

        // ! Axios
        const { data } = await axios.post(`${baseURL}/products`, formData, config);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/products`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ name, decsription, category, sizes, brand, colors, price }),
        // }, config)
        // const data = await res.json();
        // return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Update Product Action
export const updateProductAction = createAsyncThunk("product/update", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { name, description, category, sizes, brand, colors, price, totalQty, id } = payload;
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.put(`${baseURL}/products/${id}`, {
            name, description, category, sizes, brand, colors, price, totalQty
        }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Read All Products Action
export const fetchProductsAction = createAsyncThunk("product/readAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    // console.log(payload);     // !  {url: 'http://localhost:2030/api/v1/products?category=man'}
    try {
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // ! Axios
        const { data } = await axios.get(`${payload.url}`, config);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/products`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        // })
        // const data = await res.json();
        // return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Read Single Products Action
export const fetchProductAction = createAsyncThunk("product/readOne", async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // ! Axios
        const { data } = await axios.get(`${baseURL}/products/${id}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    extraReducers: (builder) => {
        // Create Product
        builder.addCase(createProductAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(createProductAction.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.isAdded = true;
            })
            .addCase(createProductAction.rejected, (state, action) => {
                state.loading = false;
                state.product = null;
                state.isAdded = false;
                state.error = action.payload;
            });

        // Update Product
        builder.addCase(updateProductAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(updateProductAction.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.isUpdated= true;
            })
            .addCase(updateProductAction.rejected, (state, action) => {
                state.loading = false;
                state.product = null;
                state.isUpdated= false;
                state.error = action.payload;
            });

        // Read All Product
        builder.addCase(fetchProductsAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(fetchProductsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.isAdded = true;
            })
            .addCase(fetchProductsAction.rejected, (state, action) => {
                state.loading = false;
                state.products = null;
                state.error = action.payload;
                state.isAdded = false;
            });

        // Read All Product
        builder.addCase(fetchProductAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(fetchProductAction.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.isAdded = true;
            })
            .addCase(fetchProductAction.rejected, (state, action) => {
                state.loading = false;
                state.product = null;
                state.error = action.payload;
                state.isAdded = false;
            });

        // Reset 
        builder.addCase(resetSuccessAction.pending, (state) => {
            state.isAdded = false;
        });
        builder.addCase(resetErrorAction.pending, (state) => {
            state.error = null;
        });
    },
});

// Generate Reducer
const productReducer = productSlice.reducer;
export default productReducer;