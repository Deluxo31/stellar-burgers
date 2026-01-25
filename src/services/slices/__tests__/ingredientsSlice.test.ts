import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice, fetchIngredients } from '../ingredientsSlice';
import { ingredientsReducer } from '../ingredientsSlice';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Мокаем API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients: TIngredient[] = [
  {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('ingredientsSlice', () => {
  /*const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };*/
  const initialState = ingredientsSlice.getInitialState();
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('синхронные редьюсеры', () => {
    it('должен обрабатывать fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchIngredients.rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('асинхронные экшены', () => {
    it('должен успешно загружать ингредиенты', async () => {
      // Мокаем успешный ответ API
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const store = configureStore({
        reducer: { ingredients: ingredientsReducer },
        preloadedState: { ingredients: initialState }
      });

      // Диспатчим асинхронный экшен
      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
      expect(getIngredientsApi).toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку при загрузке ингредиентов', async () => {
      const errorMessage = 'Сетевая ошибка';
      (getIngredientsApi as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const store = configureStore({
        reducer: { ingredients: ingredientsReducer },
        preloadedState: { ingredients: initialState }
      });

      await store.dispatch(fetchIngredients());

      const state = store.getState().ingredients;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Rejected');
      expect(state.ingredients).toEqual([]);
    });
  });
});
