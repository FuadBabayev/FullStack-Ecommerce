import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrorAction, resetSuccessAction } from "../global/globalActions";


// Initial State
const initialState = {
    loading: false,
    error: null,
    users: [],
    user: null,
    profile: {},
    userAuth: {
        loading: false,
        error: null,
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    },
};

// Registration action
export const registerUserAction = createAsyncThunk("users/register", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // Todo: Make http request with Axios
        const { data } = await axios.post(`${baseURL}/users/register`, {
            username: payload?.username,
            email: payload?.email,
            password: payload?.password,
        });
        return data;

        // Todo: Make http request with Fetch
        // const res = await fetch(`${baseURL}/users/register`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         username: payload?.username,
        //         email: payload?.email,
        //         password: payload?.password,
        //     }),
        // })
        // const data = await res.json();
        // return data;

    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// Update User ShippingAddress action
export const updateUserShippingAddressAction = createAsyncThunk("users/update-shipping-address", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { firstName, lastName, address, city, country, postalCode, province, phone, } = payload;
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Todo: Make http request with Axios
        const { data } = await axios.put(`${baseURL}/users/update/shipping`, {
            firstName: payload?.firstName,
            lastName: payload?.lastName,
            address: payload?.address,
            city: payload?.city,
            country: payload?.country,
            postalCode: payload?.postalCode,
            province: payload?.province,
            phone: payload?.phone,
        }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

// User Profile action
export const getUserProfileAction = createAsyncThunk("users/profile-get", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // Token Authenticated
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        // Todo: Make http request with Axios
        const { data } = await axios.get(`${baseURL}/users/profile`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data);
    }
});

//  Login action
// ! { email, password } = payload                  { rejectWithValue, getState, dispatch } = error
export const loginUserAction = createAsyncThunk("users/login", async (payload, error) => {
    try {
        // Todo: Make http request with Axios
        const res = await axios.post(`${baseURL}/users/login`, {
            email: payload?.email,
            password: payload?.password,
        });
        // Save user info into LocalStorage
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        return res.data;

        // Todo: Make http request with Fetch
        // const res = await fetch(`${baseURL}/users/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         email: payload?.email,
        //         password: payload?.password,
        //     }),
        // })
        // const data = await res.json();
        // localStorage.setItem('userInfo', JSON.stringify(data));
        // return data;

    } catch (err) {
        return error?.rejectWithValue(err?.response?.data);
    }
});

// LoginOut action
export const logOutUserAction = createAsyncThunk("users/logout", async (payload, { rejectWithValue, getState, dispatch }) => {
    localStorage.removeItem("userInfo");
    return true;
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUserAction.pending, (state, action) => {
            state.userAuth.loading = true;
        })
            .addCase(loginUserAction.fulfilled, (state, action) => {
                state.userAuth.loading = false;
                state.userAuth.userInfo = action.payload;
            })
            .addCase(loginUserAction.rejected, (state, action) => {
                state.userAuth.loading = false;
                state.userAuth.error = action.payload;
            });

        // Register
        builder.addCase(registerUserAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(registerUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUserAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update ShippingAddress
        builder.addCase(updateUserShippingAddressAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(updateUserShippingAddressAction.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserShippingAddressAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Profile
        builder.addCase(getUserProfileAction.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(getUserProfileAction.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getUserProfileAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Log Out
        builder.addCase(logOutUserAction.fulfilled, (state, action) => {
            state.userAuth.userInfo = null;
        });

        // Reset 
        builder.addCase(resetErrorAction.pending, (state) => {
            state.error = null;
            state.userAuth.error = null;
        });
    },
});


// Generate Reducer
const usersReducer = usersSlice.reducer;
export default usersReducer;