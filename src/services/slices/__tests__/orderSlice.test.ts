import { configureStore } from '@reduxjs/toolkit';
import { orderSlice, createOrder, fetchOrderByNumber } from '../orderSlice';
import { orderReducer } from '../orderSlice';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { clearConstructor } from '../constructorSlice';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

jest.mock('../constructorSlice', () => ({
  clearConstructor: jest.fn(() => ({
    type: 'burgerConstructor/clearConstructor'
  }))
}));

const mockOrder: TOrder = {
  _id: '60666c42cc7b410027a1a9b1',
  ingredients: ['60666c42cc7b410027a1a9b1'],
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

describe('orderSlice', () => {
 /* const initialState = {
    currentOrder: null,
    orderByNumber: null,
    isLoading: false,
    error: null
  };*/
  const initialState = orderSlice.getInitialState();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('создание заказа', () => {
    it('должен успешно создавать заказ', async () => {
      const mockApiResponse = {
        success: true,
        name: 'Space флюоресцентный бургер',
        order: mockOrder
      };

      (orderBurgerApi as jest.Mock).mockImplementation(() => {
        return Promise.resolve(mockApiResponse);
      });

      const store = configureStore({
        reducer: { order: orderReducer },
        preloadedState: { order: initialState }
      });

      const mockTest = await orderBurgerApi(['test']);

      const result = await store.dispatch(createOrder(['ingredient-1']));

      const state = store.getState().order;

      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).not.toBeNull();
      expect(state.currentOrder?.number).toBe(12345);
      expect(clearConstructor).toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку при создании заказа', async () => {
      (orderBurgerApi as jest.Mock).mockRejectedValue(
        new Error('Ошибка создания')
      );

      const store = configureStore({
        reducer: { order: orderReducer },
        preloadedState: { order: initialState }
      });

      await store.dispatch(createOrder(['ingredient-1']));

      const state = store.getState().order;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка создания');
    });
  });

  describe('получение заказа по номеру', () => {
    it('должен успешно получать заказ по номеру', async () => {
      (getOrderByNumberApi as jest.Mock).mockResolvedValue({
        orders: [mockOrder]
      });

      const store = configureStore({
        reducer: { order: orderReducer },
        preloadedState: { order: initialState }
      });

      await store.dispatch(fetchOrderByNumber(12345));

      const state = store.getState().order;

      expect(state.isLoading).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
    });

    it('должен обрабатывать ошибку при получении заказа', async () => {
      (getOrderByNumberApi as jest.Mock).mockRejectedValue(
        new Error('Заказ не найден')
      );

      const store = configureStore({
        reducer: { order: orderReducer },
        preloadedState: { order: initialState }
      });

      await store.dispatch(fetchOrderByNumber(12345));

      const state = store.getState().order;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Заказ не найден');
    });
  });
});
