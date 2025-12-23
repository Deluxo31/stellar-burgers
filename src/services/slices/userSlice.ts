import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  logoutApi,
  loginUserApi,
  registerUserApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { RootState } from '../store';

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const userUpdate = createAsyncThunk(
  'user/userUpdate',
  async (user: Partial<TRegisterData>) => {
    const response = updateUserApi(user);
    return (await response).user;
  }
);

export const userLogout = createAsyncThunk('user/userLogout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const UserLogin = createAsyncThunk(
  'user/userLogin',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk<void, void>(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        await dispatch(getUser()).unwrap();
      } catch (e) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка регистрации';
      })

      // loginUser
      .addCase(UserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка авторизации';
      })

      // getUser
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка авторизации';
        state.isAuthChecked = true;
      })

      // updateUser
      .addCase(userUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(userUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка получения данных пользователя ';
      })

      // logout
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Ошибка выхода';
      });
  }
});

export const { authCheck, clearError } = userSlice.actions;

export const getUserSelector = (state: RootState) => state.user.user;
export const getIsAuthSelector = (state: RootState) => !!state.user.user;
export const getIsAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const getErrorSelector = (state: RootState) => state.user.error;

export const userReducer = userSlice.reducer;
