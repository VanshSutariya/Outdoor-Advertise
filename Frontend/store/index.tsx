import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import cartSlice from './cart-slice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = { key: 'user', storage };
const PersistedReducer = persistReducer(persistConfig, authSlice);
const store = configureStore({
  reducer: {
    auth: PersistedReducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
