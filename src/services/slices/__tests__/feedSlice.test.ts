import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, fetchFeed } from '../feedSlice';
import { feedReducer } from '../feedSlice';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockFeed = {
  orders: [],
  total: 1000,
  totalToday: 100
};

describe('feedSlice', () => {
  /*const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };*/
  const initialState = feedSlice.getInitialState();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('асинхронные экшены', () => {
    it('должен успешно загружать ленту заказов', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeed);

      const store = configureStore({
        reducer: { feed: feedReducer },
        preloadedState: { feed: initialState }
      });

      await store.dispatch(fetchFeed());

      const state = store.getState().feed;

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(100);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать ошибку при загрузке ленты', async () => {
      (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Ошибка ленты'));

      const store = configureStore({
        reducer: { feed: feedReducer },
        preloadedState: { feed: initialState }
      });

      await store.dispatch(fetchFeed());

      const state = store.getState().feed;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка ленты');
    });
  });
});
