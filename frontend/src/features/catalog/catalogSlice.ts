import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
  "catalog/fetchProductsAsync",
  async (arg, thunkAPI) => {
    try {
      return agent.Catalog.list();
    } catch (error: any) {
      thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (id, thunkAPI) => {
    try {
      return agent.Catalog.details(id);
    } catch (error: any) {
      thunkAPI.rejectWithValue({
        error: error.data,
      });
    }
  }
);
export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    loaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.loaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state) => {
      state.status = "idle";
      state.loaded = false;
    });

    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "loadingProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
