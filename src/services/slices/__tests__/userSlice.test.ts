import { configureStore } from '@reduxjs/toolkit';
import {  getUser, UserLogin, registerUser } from '../userSlice';
import { userReducer } from '../userSlice';
import { 
  getUserApi, 
  loginUserApi, 
  registerUserApi 
} from '@api';
import { TUser } from '@utils-types';

jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn()
}));

// Мокаем cookie utils
jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('получение пользователя', () => {
    it('должен успешно получать данные пользователя', async () => {
      (getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(getUser());
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать ошибку при получении данных пользователя', async () => {
      (getUserApi as jest.Mock).mockRejectedValue(new Error('Ошибка пользователя'));
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(getUser());
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('авторизация пользователя', () => {
    it('должен успешно авторизовывать пользователя', async () => {
      (loginUserApi as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(UserLogin({ email: 'test@example.com', password: 'password' }));
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать ошибку при авторизации', async () => {
      (loginUserApi as jest.Mock).mockRejectedValue(new Error('Неверные данные'));
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(UserLogin({ email: 'wrong@example.com', password: 'wrong' }));
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('регистрация пользователя', () => {
    it('должен успешно регистрировать пользователя', async () => {
      (registerUserApi as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(registerUser({
        email: 'new@example.com',
        name: 'New User',
        password: 'password'
      }));
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать ошибку при регистрации', async () => {
      (registerUserApi as jest.Mock).mockRejectedValue(new Error('Пользователь существует'));
      
      const store = configureStore({
        reducer: { user: userReducer },
        preloadedState: { user: initialState }
      });
      
      await store.dispatch(registerUser({
        email: 'exist@example.com',
        name: 'Existing User',
        password: 'password'
      }));
      
      const state = store.getState().user;
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });
});