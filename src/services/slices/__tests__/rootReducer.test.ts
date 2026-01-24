// src/services/slices/__tests__/rootReducer.test.ts
import { rootReducer } from '../../store';

describe('rootReducer', () => {
  const expectedInitialState = {
    ingredients: {
      ingredients: [],
      isLoading: false,
      error: null
    },
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    feed: {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    },
    order: {
      currentOrder: null,
      orderByNumber: null,
      isLoading: false,
      error: null
    },
    user: {
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    },
    userOrders: {
      orders: [],
      isLoading: false,
      error: null
    }
  };

  it('должен правильно инициализироваться со всеми слайсами (с @@INIT)', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState).toEqual(expectedInitialState);
  });

  //ТЕСТ С UNKNOWN_ACTION 
  it('должен возвращать корректное начальное состояние для неизвестного экшена (с UNKNOWN_ACTION)', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(state).toEqual(expectedInitialState);
  });
});