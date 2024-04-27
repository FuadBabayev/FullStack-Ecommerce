import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction, resetSuccessAction } from "../global/globalActions";


// Initial State
const initialState = {
    loading: false,
    error: null,
    brands: [],
    brand: {},
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// Create Brand Action
export const createBrandAction = createAsyncThunk("brand/create", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { name } = payload;
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // ! Axios
        const { data } = await axios.post(`${baseURL}/brands`, { name }, config);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/brands`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ name }),
        // }, config)
        // const data = await res.json();
        // return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Read All Brands Action
export const fetchBrandsAction = createAsyncThunk("brand/readAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // ! Axios
        const { data } = await axios.get(`${baseURL}/brands`);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/brands`, {
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

// Slice
const brandSlice = createSlice({
    name: 'brands',
    initialState,
    extraReducers: (builder) => {
        // Create Brand
        builder.addCase(createBrandAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(createBrandAction.fulfilled, (state, action) => {
                state.loading = false;
                state.brand = action.payload;
                state.isAdded = true;
            })
            .addCase(createBrandAction.rejected, (state, action) => {
                state.loading = false;
                state.brand = null;
                state.isAdded = false;
                state.error = action.payload;
            });

        // Read All Brands
        builder.addCase(fetchBrandsAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(fetchBrandsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
                state.isAdded = true;
            })
            .addCase(fetchBrandsAction.rejected, (state, action) => {
                state.loading = false;
                state.brands = null;
                state.isAdded = false;
                state.error = action.payload;
            });

        // Reset
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
        });
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        });
    },
});

// Generate Reducer
const brandReducer = brandSlice.reducer;
export default brandReducer;