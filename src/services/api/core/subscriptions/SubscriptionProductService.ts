import { ApiService } from "@/services/api/ApiService";
import store from "@/store";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { ISubscriptionProductService } from "./ISubscriptionProductService";
import { setCurrency, setProducts } from "@/store/modules/pricingReducer";
import i18n from "@/locale/i18n";

export class SubscriptionProductService extends ApiService implements ISubscriptionProductService {
  constructor() {
    super("SubscriptionProduct");
  }
  getProducts(): Promise<SubscriptionProductDto[]> {
    return new Promise((resolve, reject) => {
      return super
        .getAll()
        .then((response: SubscriptionProductDto[]) => {
          const currencies: string[] = [];
          response.forEach((product) => {
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
          store.dispatch(setProducts(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  createProduct(product: SubscriptionProductDto): Promise<SubscriptionProductDto> {
    product.title = i18n.t(product.title).toString();
    product.description = i18n.t(product.description).toString();
    return super.post(product, `CreateProduct`);
  }
}
