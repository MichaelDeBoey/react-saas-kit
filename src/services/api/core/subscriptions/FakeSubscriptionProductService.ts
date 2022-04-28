/* eslint-disable @typescript-eslint/no-unused-vars */
import store from "@/store";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import plans from "@/application/pricing/plans";
import { ISubscriptionProductService } from "./ISubscriptionProductService";
import { setCurrency, setProducts } from "@/store/modules/pricingReducer";

export class FakeSubscriptionProductService implements ISubscriptionProductService {
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, _reject) => {
      store.dispatch(setProducts(plans));
      setTimeout(() => {
        const currencies: string[] = [];
        plans.forEach((product) => {
          product.prices.forEach((price) => {
            if (!currencies.includes(price.currency)) {
              currencies.push(price.currency);
            }
          });
        });
        const { pricing } = store.getState();
        if (currencies.length > 0 && !currencies.includes(pricing.currency)) {
          store.dispatch(setCurrency(currencies[0]));
        }
        store.dispatch(setProducts(plans));
        resolve(plans);
      }, 500);
    });
  }
  createProduct(_product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
