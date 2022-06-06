import { Basket } from "../../app/models/basket";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

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
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = `${action.meta.arg.productId}add`;
    });

    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket = action.payload;
      state.status = "idle";
    });
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
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
  },
});
export const { setBasket } = basketSlice.actions;
