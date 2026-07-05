import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const initialState = {
    loading: false,
    error: null,

    users: [],

    pagination: {
        totalPages: 0,
        totalCount: 0,
    },
};

// ======================
// GET USERS
// ======================

export const getUsers = createAsyncThunk(
    "admin/getUsers",
    async (params = {}, { rejectWithValue }) => {
        try {

            const response = await api.get(
                API_ROUTES.ADMIN.USER.USERS,
                {
                    params: {
                        search: params.search || "",
                        isBlocked:
                            params.isBlocked === undefined
                                ? undefined
                                : params.isBlocked,
                        page: params.page || 1,
                        limit: params.limit || 10,
                    },
                }
            );
            console.log("success")
            console.log(response)

            return response.data.data;

        } catch (error) {
            console.log("error")
            console.log(error)
            console.log(error.response)
            console.log(error.message)


            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch users."
            );

        }
    }
);

// ======================
// BLOCK / UNBLOCK USER
// ======================

export const updateUserStatus = createAsyncThunk(
    "admin/updateUserStatus",
    async ({ userId, isBlocked }, { rejectWithValue }) => {

        try {

            const response = await api.patch(

                API_ROUTES.ADMIN.USER.UPDATE_STATUS(userId),

                {
                    isBlocked,
                }

            );

            return response.data.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update user status."
            );

        }
    }
);

const adminUserSlice = createSlice({

    name: "adminUser",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            // ==========================
            // GET USERS
            // ==========================

            .addCase(getUsers.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(getUsers.fulfilled, (state, action) => {

                state.loading = false;

                state.users = action.payload.data;

                state.pagination.totalPages =
                    action.payload.totalPages;

                state.pagination.totalCount =
                    action.payload.totalCount;

            })

            .addCase(getUsers.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })

            // ==========================
            // UPDATE STATUS
            // ==========================

            .addCase(updateUserStatus.pending, (state) => {

                state.loading = true;

            })

            .addCase(updateUserStatus.fulfilled, (state, action) => {

                state.loading = false;

                const updatedUser = action.payload;

                const index = state.users.findIndex(

                    (user) => user._id === updatedUser._id

                );

                if (index !== -1) {

                    state.users[index] = updatedUser;

                }

            })

            .addCase(updateUserStatus.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

    },

});

export default adminUserSlice.reducer;