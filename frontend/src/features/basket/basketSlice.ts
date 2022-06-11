import { Basket } from "../../app/models/basket";
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

export const fetchBasketAsync = createAsyncThunk<Basket>(
  "basket/fetchBasketAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Basket.get();
    } catch (e: any) {
      return thunkAPI.rejectWithValue({ error: e.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) return false;
    },
  }
);

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (err: any) {
      thunkAPI.rejectWithValue({ error: err.data });
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity?: number; deleting?: boolean }
>(
  "basket/removeBasketItemAsync",
  async ({ productId, quantity = 1, deleting = false }, thunkAPI) => {
    try {
      await agent.Basket.deleteItem(productId, quantity);
    } catch (err: any) {
      thunkAPI.rejectWithValue({ error: err.data });
    }
  }
);
export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    removeBasket: (state) => {
      state.basket = null;
    },
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = `${action.meta.arg.productId}add`;
    });

    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      let str = action.meta.arg.deleting ? "del" : "rem";
      state.status = `${action.meta.arg.productId + str}`;
    });

    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId } = action.meta.arg;
      const quantity = action.meta.arg.quantity ?? 1;
      const itemIndex = state.basket?.items.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex === undefined || itemIndex < 0) return;
      state.basket!.items[itemIndex].quantity -= quantity;
      if (state.basket!.items[itemIndex].quantity < 1)
        state.basket!.items.splice(itemIndex, 1);
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
    });

    builder.addMatcher(
      isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled),
      (state, action) => {
        state.basket = action.payload;
        state.status = "idle";
      }
    );

    builder.addMatcher(
      isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected),
      (state, action) => {
        state.status = "idle";
      }
    );
  },
});
export const { removeBasket, setBasket } = basketSlice.actions;
