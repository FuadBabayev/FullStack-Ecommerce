import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction, resetSuccessAction } from "../global/globalActions";


// Initial State
const initialState = {
    loading: false,
    error: null,
    colors: [],
    color: {},
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// Create Color Action
export const createColorAction = createAsyncThunk("color/create", async (payload, { rejectWithValue, getState, dispatch }) => {
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
        const { data } = await axios.post(`${baseURL}/colors`, { name }, config);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/colors`, {
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

// Read All Colors Action
export const fetchColorsAction = createAsyncThunk("color/readAll", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // ! Axios
        const { data } = await axios.get(`${baseURL}/colors`);
        return data;

        // ! Fetch
        // const res = await fetch(`${baseURL}/colors`, {
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
const colorSlice = createSlice({
    name: 'colors',
    initialState,
    extraReducers: (builder) => {
        // Create Brand
        builder.addCase(createColorAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(createColorAction.fulfilled, (state, action) => {
                state.loading = false;
                state.color = action.payload;
                state.isAdded = true;
            })
            .addCase(createColorAction.rejected, (state, action) => {
                state.loading = false;
                state.color = null;
                state.isAdded = false;
                state.error = action.payload;
            });

        // Read All Brands
        builder.addCase(fetchColorsAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(fetchColorsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.colors = action.payload;
                state.isAdded = true;
            })
            .addCase(fetchColorsAction.rejected, (state, action) => {
                state.loading = false;
                state.colors = null;
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
const colorReducer = colorSlice.reducer;
export default colorReducer;