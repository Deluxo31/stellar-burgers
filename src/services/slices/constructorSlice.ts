import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { RootState } from '../store';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      }

      const ingredient = action.payload;

      // Проверяем обязательные поля
      if (!ingredient.id) {
        return;
      }
      state.ingredients.push(action.payload);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      if (!state.ingredients) {
        state.ingredients = [];
        return;
      }
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];

      const [moveItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, moveItem);
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  setBun,
  deleteIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export const burgerConstructorReducer = constructorSlice.reducer;
export const getBun = (state: RootState) => state.burgerConstructor.bun;
export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
