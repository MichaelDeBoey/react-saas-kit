import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { Theme } from "@/application/enums/shared/Theme";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";

export interface RootState {
  appName: string;
  version: string;
  locale: LocaleState;
  auth: AuthState;
  tenant: TenantState;
  account: AccountState;
  pricing: PricingState;
  theme: ThemeState;
  app: AppState;
}

export interface LocaleState {
  locale: string;
}

export interface AuthState {
  authenticated: boolean;
  token: string;
}
export interface TenantState {
  tenants: TenantDto[];
  current: TenantDto | null;
  subscription: SubscriptionGetCurrentResponse | null;
  members: TenantUserDto[];
  workspaces: WorkspaceDto[];
  currentWorkspace: WorkspaceDto | null;
  features: TenantFeaturesDto | null;
}
export interface AccountState {
  user: UserDto | null;
}
export interface PricingState {
  products: SubscriptionProductDto[];
  selectedProduct: SubscriptionProductDto | null;
  billingPeriod: SubscriptionBillingPeriod;
  currency: string;
}
export interface ThemeState {
  value: Theme;
}

export interface AppState {
  usage: AppUsageSummaryDto;
  features: TenantFeaturesDto;
  layout: ApplicationLayout;
}
