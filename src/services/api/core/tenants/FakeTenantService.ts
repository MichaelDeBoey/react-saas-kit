/* eslint-disable @typescript-eslint/no-unused-vars */
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { ITenantService } from "./ITenantService";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { TenantUserJoined } from "@/application/enums/core/tenants/TenantUserJoined";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";

import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import fakeNamesAndEmails from "./FakeNamesAndEmails";
import { UserType } from "@/application/enums/core/users/UserType";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import store from "@/store";
import { FakeSubscriptionManagerService } from "../subscriptions/FakeSubscriptionManagerService";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { setFeatures, setUsage } from "@/store/modules/appReducer";
import { setSettings } from "@/store/modules/tenantReducer";

const fakeSubscriptionManagerService = new FakeSubscriptionManagerService();

const createTenant = (index: number): TenantDto => {
  const tenant: TenantDto = {
    id: index.toString(),
    uuid: "string",
    name: "Tenant " + index,
    domain: "",
    subdomain: "",
    icon: "",
    logo: "",
    logoDarkmode: "",
    subscriptionCustomerId: "",
    subscriptionPlanId: "",
    users: [],
    products: fakeSubscriptionManagerService?.currentSubscription?.activeProduct,
    currentUser: {} as TenantUserDto,
    workspaces: [],
  };
  return tenant;
};

const tenants: TenantDto[] = [createTenant(1), createTenant(2), createTenant(3)];

const types = [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST];
const users: TenantUserDto[] = [];
for (let idxType = 0; idxType < types.length; idxType++) {
  const type = types[idxType];
  users.push({
    id: (idxType + 1).toString(),
    tenantId: "",
    tenant: {} as TenantDto,
    userId: idxType.toString(),
    user: {
      id: idxType.toString(),
      type: UserType.Tenant,
      email: fakeNamesAndEmails[idxType].email,
      firstName: fakeNamesAndEmails[idxType].firstName,
      lastName: fakeNamesAndEmails[idxType].lastName,
      phone: "",
      loginType: UserLoginType.PASSWORD,
      avatar: "",
      token: "",
      defaultTenantId: 1,
      defaultTenant: {} as TenantDto,
      tenants: [],
      currentTenant: {} as TenantDto,
      timezone: "",
      locale: "",
    },
    role: type,
    joined: TenantUserJoined.CREATOR,
    status: TenantUserStatus.ACTIVE,
    chatbotToken: "",
    uuid: "",
    accepted: true,
    email: fakeNamesAndEmails[idxType].email,
    firstName: fakeNamesAndEmails[idxType].firstName,
    lastName: fakeNamesAndEmails[idxType].lastName,
    phone: fakeNamesAndEmails[idxType].phone,
    avatar: fakeNamesAndEmails[idxType].avatar,
  });
}

tenants.forEach((element) => {
  element.currentUser = users.find((f) => f.role === TenantUserRole.OWNER) ?? users[0];
  element.users = users;
  users.forEach((user) => {
    user.tenant.name = element.name;
  });
});

export class FakeTenantService implements ITenantService {
  tenants: TenantDto[] = tenants;
  adminGetAll(): Promise<TenantDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(tenants);
      }, 500);
    });
  }
  adminGetProducts(_id: string): Promise<TenantProductDto[]> {
    return Promise.resolve(tenants[0].products);
  }
  getAll(): Promise<TenantDto[]> {
    return Promise.resolve(this.tenants);
  }
  get(id: string): Promise<TenantDto> {
    const tenant = this.tenants.find((f) => f.id === id);
    if (tenant) {
      return Promise.resolve(tenant);
    } else {
      return Promise.reject();
    }
  }
  getFeatures(): Promise<TenantFeaturesDto> {
    const { tenant } = store.getState();
    let currentSubcription: TenantProductDto | undefined;
    const tenantProducts = tenant.subscription?.activeProduct;
    if (tenantProducts && tenantProducts.length > 0) {
      currentSubcription = tenantProducts[0] ?? this.tenants[0].products[0];
    }
    const features: TenantFeaturesDto = {
      maxWorkspaces: currentSubcription?.maxWorkspaces ?? 0,
      maxUsers: currentSubcription?.maxUsers ?? 0,
      maxLinks: currentSubcription?.maxLinks ?? 0,
      maxStorage: currentSubcription?.maxStorage ?? 0,
      monthlyContracts: currentSubcription?.monthlyContracts ?? 0,
    };
    store.dispatch(setFeatures(features));
    return Promise.resolve(features);
  }
  getCurrentUsage(_type: AppUsageType): Promise<AppUsageSummaryDto> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary: AppUsageSummaryDto = {
          type: 0,
          providers: 10,
          providersInCompliance: 6,
          clients: 4,
          contracts: 3,
          employees: 20,
          storage: 0.1,
          pendingInvitations: 1,
        };
        store.dispatch(setUsage(summary));
        resolve(summary);
      }, 2000);
    });
  }
  create(_payload: TenantCreateRequest): Promise<UserLoggedResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  update(_payload: TenantDto): Promise<TenantDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updateImage(_payload: TenantUpdateImageRequest): Promise<TenantDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  delete(): Promise<void> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  adminDelete(id: string): Promise<void> {
    return Promise.reject("[SANDBOX] Method not implemented." + id);
  }
}
