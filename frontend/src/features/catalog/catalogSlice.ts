import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

const productsAdapter = createEntityAdapter<Product>();

interface CatalogState {
  loaded: boolean;
  status: string;
  filtersLoaded: boolean;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}
const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);
  if (productParams.search) params.append("search", productParams.search);
  if (productParams.brands)
    params.append("brands", productParams.brands.toString());
  if (productParams.types)
    params.append("types", productParams.types.toString());
  return params;
};
export const fetchProductsAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("catalog/fetchProductsAsync", async (arg, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
  try {
    const res = await agent.Catalog.list(params);
    thunkAPI.dispatch(setMetaData(res.metaData));
    return res.items;
  } catch (error: any) {
    thunkAPI.rejectWithValue({ error: error.data });
  }
});

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
export const getFilters = createAsyncThunk(
  "basket/getFilters",
  async (_, thunkAPI) => {
    try {
      return agent.Catalog.filters();
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.data);
    }
  }
);
const initParams = () => {
  return {
    pageSize: 6,
    pageNumber: 1,
    orderBy: "name",
  };
};
export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    loaded: false,
    status: "idle",
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    setProductParams: (state, action) => {
      state.loaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state, action) => {
      state.productParams = initParams();
    },
  },
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

    builder.addCase(getFilters.pending, (state) => {
      state.status = "pendingFilters";
    });
    builder.addCase(getFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands.sort();
      state.types = action.payload.types.sort();
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(getFilters.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
export const { setProductParams, resetProductParams, setMetaData } =
  catalogSlice.actions;
