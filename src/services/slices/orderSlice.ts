import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { clearConstructor } from './constructorSlice';

type TOrderState = {
  currentOrder: TOrder | null;
  orderByNumber: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  orderByNumber: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    dispatch(clearConstructor());
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrder, clearOrderByNumber } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
export default orderSlice.reducer;

// Селекторы для заказа
export const getOrder = (state: RootState) => state.order.currentOrder;
export const getOrderLoading = (state: RootState) => state.order.isLoading;
export const getOrderByNumber = (state: RootState) => state.order.orderByNumber;
