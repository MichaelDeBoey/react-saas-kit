import { SubscriptionProductDto } from "./SubscriptionProductDto";
import { MasterEntityDto } from "../MasterEntityDto";
import { SubscriptionPlanDto } from "./SubscriptionPlanDto";
import { SubscriptionPriceType } from "@/application/enums/core/subscriptions/SubscriptionPriceType";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";

export interface SubscriptionPriceDto extends MasterEntityDto {
  serviceId: string;
  type: SubscriptionPriceType;
  billingPeriod: SubscriptionBillingPeriod;
  price: number;
  currency: string;
  trialDays: number;
  active: boolean;
  priceBefore?: number;
  subscriptionProductId?: string;
  subscriptionProduct?: SubscriptionProductDto;
  subscriptionPlan?: SubscriptionPlanDto;
}
