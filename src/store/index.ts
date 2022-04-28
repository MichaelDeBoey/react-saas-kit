import { combineReducers, createStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "./localStorage";
import themeReducer from "./modules/themeReducer";
import authReducer from "./modules/authReducer";
import throttle from "lodash.throttle";
import accountReducer from "./modules/accountReducer";
import tenantReducer from "./modules/tenantReducer";
import pricingReducer from "./modules/pricingReducer";
import appReducer from "./modules/appReducer";

const reducers = combineReducers({
  account: accountReducer,
  auth: authReducer,
  tenant: tenantReducer,
  pricing: pricingReducer,
  theme: themeReducer,
  app: appReducer,
});

const persistedState = loadState();
const store = createStore(reducers, persistedState);
store.subscribe(
  throttle(() => {
    saveState({
      account: store.getState().account,
      auth: store.getState().auth,
      tenant: store.getState().tenant,
      pricing: store.getState().pricing,
      theme: store.getState().theme,
      app: store.getState().app,
    });
  }, 1000)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
