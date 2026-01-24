import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    // console.log('✅✅✅✅ Отправляем запрос к API для получения ингредиентов✅✅✅✅');

    try {
      const data = await getIngredientsApi();
      //console.log('✅✅✅✅ Ингредиенты получены с сервера:✅✅✅✅', data);
      return data;
    } catch (error) {
      console.error('❌ Ошибка при загрузке ингредиентов:', error);
      return rejectWithValue(
        error instanceof Error
          ? 'Ошибка загрузки ингредиентов'
          : 'Неизвестная ошибка'
      );
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});
export const ingredientsReducer = ingredientsSlice.reducer;
export default ingredientsSlice.reducer;

// Селекторы для ингредиентов
export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
