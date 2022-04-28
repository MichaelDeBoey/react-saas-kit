import { MasterEntityDto } from "../MasterEntityDto";
import { SubscriptionProductDto } from "./SubscriptionProductDto";

export interface SubscriptionFeatureDto extends MasterEntityDto {
  order: number;
  subscriptionProductId?: string;
  subscriptionProduct?: SubscriptionProductDto;
  key: string;
  value: string;
  included: boolean;
}
