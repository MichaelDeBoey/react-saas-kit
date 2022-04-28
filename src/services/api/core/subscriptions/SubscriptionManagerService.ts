import { ApiService } from "@/services/api/ApiService";
import store from "@/store";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import { SelectedSubscriptionRequest } from "@/application/contracts/core/subscriptions/SelectedSubscriptionRequest";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { ISubscriptionManagerService } from "./ISubscriptionManagerService";
import { setSubscription } from "@/store/modules/tenantReducer";
import { setBillingPeriod, setProduct, setSelected } from "@/store/modules/pricingReducer";

export class SubscriptionManagerService extends ApiService implements ISubscriptionManagerService {
  constructor() {
    super("SubscriptionManager");
  }
  getCurrentSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .get("GetCurrentSubscription")
        .then((subscription: SubscriptionGetCurrentResponse) => {
          store.dispatch(setSubscription(subscription));
          if (subscription.myProducts?.length > 0) {
            store.dispatch(setProduct(subscription.myProducts[0].subscriptionProduct));
            store.dispatch(setBillingPeriod(subscription.myProducts[0].subscriptionPrice.billingPeriod));
          }
          resolve(subscription);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getCoupon(couponId: string, currency: string): Promise<SubscriptionCouponDto> {
    return super.get(`GetCoupon/${couponId}/${currency}`);
  }
  updateSubscription(subscription: SelectedSubscriptionRequest): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      return super
        .post(subscription, `UpdateSubscription`)
        .then((response) => {
          store.dispatch(setSubscription(response));
          if (response.myProducts?.length > 0) {
            store.dispatch(setProduct(response.myProducts[0].subscriptionProduct));
            store.dispatch(setBillingPeriod(response.myProducts[0].subscriptionPrice.billingPeriod));
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  cancelSubscription(): Promise<SubscriptionGetCurrentResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, "CancelSubscription")
        .then((response) => {
          store.dispatch(setSubscription(response));
          if (response.myProducts?.length > 0) {
            store.dispatch(setProduct(response.myProducts[0].subscriptionProduct));
            store.dispatch(setBillingPeriod(response.myProducts[0].subscriptionPrice.billingPeriod));
          }
          store.dispatch(
            setSelected({
              product: null,
              billingPeriod: SubscriptionBillingPeriod.MONTHLY,
            })
          );
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateCardToken(cardToken: string): Promise<SubscriptionGetCurrentResponse> {
    return super.post(cardToken, `UpdateCardToken/${cardToken}`);
  }
  createCustomerPortalSession(): Promise<SubscriptionGetCurrentResponse> {
    return super.post(null, `CreateCustomerPortalSession`);
  }
}
