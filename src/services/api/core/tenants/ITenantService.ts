import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";

export interface ITenantService {
  adminGetAll(): Promise<TenantDto[]>;
  adminGetProducts(id: string): Promise<TenantProductDto[]>;
  getAll(): Promise<TenantDto[]>;
  get(id: string): Promise<TenantDto>;
  getFeatures(): Promise<TenantFeaturesDto>;
  getCurrentUsage(type: AppUsageType): Promise<AppUsageSummaryDto>;
  create(payload: TenantCreateRequest): Promise<UserLoggedResponse>;
  update(payload: TenantDto): Promise<TenantDto>;
  updateImage(payload: TenantUpdateImageRequest): Promise<TenantDto>;
  adminDelete(id: string): Promise<void>;
}
