import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./services/authService";
import { isAuthenticated } from "../../core/auth/tokenStorage";

const INITIAL = {
  name: "",
  email: "",
  password: "",
  mobile: "",
  role: "user",
};

export const registerUserAsync = createAsyncThunk(
  "auth/register",
  async (fields, { rejectWithValue }) => {
    try {
      const user = await authService.register(fields);
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (fields, { rejectWithValue }) => {
    try {
      const data = await authService.login(fields);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    fields: INITIAL,
    user: null,
    isAuthenticated: isAuthenticated(),
    loading: false,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      state.fields[action.payload.name] = action.payload.value;
    },
    handleToggle: (state) => {
      state.fields.role = state.fields.role === "user" ? "owner" : "user";
    },
    resetFields: (state) => {
      state.fields = INITIAL;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.fields = INITIAL;
      });
  },
});

export const { updateField, handleToggle, resetFields } = authSlice.actions;
export default authSlice.reducer;
