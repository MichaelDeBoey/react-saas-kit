import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";

export interface ISubscriptionProductService {
  getProducts(): Promise<SubscriptionProductDto[]>;
  createProduct(product: SubscriptionProductDto): Promise<SubscriptionProductDto>;
}
