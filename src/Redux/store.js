import { configureStore } from '@reduxjs/toolkit';
import domainReducer from './slice.js';

const store = configureStore({
  reducer: {
    domains: domainReducer,
  },
});

export default store;