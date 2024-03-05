import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/auth/AuthReducer.js"
// import { loadState } from '../services/browserStorage.ts';

export const store = configureStore({
  reducer: authReducer,
  // preloadedState: loadState(),

  // en production, devtools doit etre false
  // devtools: true,
})
