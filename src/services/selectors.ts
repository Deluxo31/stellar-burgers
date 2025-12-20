import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Селекторы для конструктора
export const getConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const getConstructorItems = createSelector(
  [getConstructorState],
  (constructorState) => ({
    bun: constructorState.bun || null,
    ingredients: constructorState.ingredients || []
  })
);

export const getBun = (state: RootState) => state.burgerConstructor.bun;
export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

// Подсчёт ингредиентов для счетчиков
export const getIngredientCounts = createSelector(
  [getConstructorState],
  (constructorState): Record<string, number> => {
    const counts: Record<string, number> = {};
    const { bun, ingredients } = constructorState;

    // Считаем начинки
    ingredients.forEach((item) => {
      counts[item._id] = (counts[item._id] || 0) + 1;
    });

    // Булки всегда 2
    if (bun) {
      counts[bun._id] = 2;
    }

    return counts;
  }
);
