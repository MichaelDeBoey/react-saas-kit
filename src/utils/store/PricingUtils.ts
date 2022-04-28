import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";

const selectedProductTitle = (): string => {
  const { pricing } = store.getState();
  return pricing.selectedProduct?.title ?? "";
};
const selectedPrice = (): SubscriptionPriceDto | null => {
  const { pricing } = store.getState();
  const prices = pricing.selectedProduct?.prices;
  if (prices && prices.length > 0) {
    return (
      // tslint:disable-next-line: max-line-length
      prices.find((e) => e.billingPeriod === pricing.billingPeriod && e.currency === pricing.currency) ??
      prices.filter((f) => f.currency === pricing.currency)[0]
    );
  }
  return null;
};
const selectedBillingPeriod = (): string => {
  const { pricing } = store.getState();
  const price = selectedPrice();
  if (price?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
    return "once";
  } else {
    return SubscriptionBillingPeriod[pricing.billingPeriod] + "Short";
  }
};

export default {
  selectedProductTitle,
  selectedPrice,
  selectedBillingPeriod,
};
