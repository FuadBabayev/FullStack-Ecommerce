import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction, resetSuccessAction } from "../global/globalActions";


// Initial State
const initialState = {
    loading: false,
    error: null,
    categories: [],
    category: {},
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// Create Category Action
export const createCategorytAction = createAsyncThunk("category/create", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { name, file } = payload;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);
        
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // ! Axios
        const { data } = await axios.post(`${baseURL}/categories`, formData, config);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/categories`, {
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

// Read All Categories Action
export const fetchCategoriestAction = createAsyncThunk("category/readAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // ! Axios
        const { data } = await axios.get(`${baseURL}/categories`);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/categories`, {
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
const categorySlice = createSlice({
    name: 'categories',
    initialState,
    extraReducers: (builder) => {
        // Create Category
        builder.addCase(createCategorytAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(createCategorytAction.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
                state.isAdded = true;
            })
            .addCase(createCategorytAction.rejected, (state, action) => {
                state.loading = false;
                state.category = null;
                state.isAdded = false;
                state.error = action.payload;
            });

        // Read All Categories
        builder.addCase(fetchCategoriestAction.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchCategoriestAction.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(fetchCategoriestAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
            state.error = action.payload;
        });
        
        // Reset
        builder.addCase(resetErrorAction.pending, (state) => {
            state.error = null;
        });
        builder.addCase(resetSuccessAction.pending, (state) => {
            state.isAdded = false;
        });
    },
});

// Generate Reducer
const categoryReducer = categorySlice.reducer;
export default categoryReducer;