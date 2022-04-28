import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionPriceType } from "@/application/enums/core/subscriptions/SubscriptionPriceType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PricingState } from "../types";

const initialState: PricingState = {
  products: [],
  selectedProduct: null,
  billingPeriod: SubscriptionBillingPeriod.MONTHLY,
  currency: import.meta.env.VITE_REACT_APP_CURRENCY?.toString() ?? "usd",
};

export const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    hydrate: (state, action) => {
      return action.payload;
    },
    resetPricingState: (state) => {
      state.products = initialState.products;
      state.selectedProduct = initialState.selectedProduct;
      state.billingPeriod = initialState.billingPeriod;
      state.currency = initialState.currency;
    },
    setProducts: (state: PricingState, { payload }: PayloadAction<SubscriptionProductDto[]>) => {
      state.products = payload.slice().sort((x, y) => {
        return x.tier > y.tier ? 1 : -1;
      });
      if (payload.length > 0) {
        payload.forEach((product) => {
          product.prices.forEach((price) => {
            if (price.type === SubscriptionPriceType.RECURRING) {
              if (!state.currency) {
                state.currency = price.currency;
              }
            }
          });
        });
      }
    },
    setSelected: (state: PricingState, { payload }: PayloadAction<{ billingPeriod: SubscriptionBillingPeriod; product: SubscriptionProductDto | null }>) => {
      state.billingPeriod = payload.billingPeriod;
      state.selectedProduct = payload.product;
    },
    setProduct: (state: PricingState, { payload }: PayloadAction<SubscriptionProductDto>) => {
      state.selectedProduct = payload;
    },
    setBillingPeriod: (state: PricingState, { payload }: PayloadAction<SubscriptionBillingPeriod>) => {
      state.billingPeriod = payload;
    },
    setCurrency: (state: PricingState, { payload }: PayloadAction<string>) => {
      state.currency = payload;
    },
  },
});

export const { resetPricingState, setProducts, setSelected, setProduct, setBillingPeriod, setCurrency, hydrate } = pricingSlice.actions;

export default pricingSlice.reducer;
