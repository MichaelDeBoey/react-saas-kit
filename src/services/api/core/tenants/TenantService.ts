import store from "@/store";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { ApiService } from "@/services/api/ApiService";
import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { ITenantService } from "./ITenantService";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { setFeatures, setUsage } from "@/store/modules/appReducer";
import { setMyTenants, setSettings } from "@/store/modules/tenantReducer";

export class TenantService extends ApiService implements ITenantService {
  constructor() {
    super("Tenant");
  }
  adminGetAll(): Promise<TenantDto[]> {
    return super.getAll("Admin/GetAll");
  }
  adminGetProducts(id: string): Promise<TenantProductDto[]> {
    return super.get("GetProducts", id);
  }
  getAll(): Promise<TenantDto[]> {
    return new Promise((resolve, reject) => {
      return super
        .getAll()
        .then((response: TenantDto[]) => {
          store.dispatch(setMyTenants(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get(id: string): Promise<TenantDto> {
    return super.get("Get", id);
  }
  getFeatures(): Promise<TenantFeaturesDto> {
    return new Promise((resolve, reject) => {
      super
        .get("GetFeatures")
        .then((response: TenantFeaturesDto) => {
          store.dispatch(setFeatures(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCurrentUsage(type: AppUsageType): Promise<AppUsageSummaryDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return super
          .get("GetCurrentUsage/" + type)
          .then((response) => {
            store.dispatch(setUsage(response));
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }, 2000);
    });
  }
  create(payload: TenantCreateRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload)
        .then((response: UserLoggedResponse) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  update(payload: TenantDto): Promise<TenantDto> {
    const { tenant } = store.getState();
    const tenantId = tenant?.current?.id ?? "";
    return new Promise((resolve, reject) => {
      super
        .put(tenantId, payload)
        .then((response: TenantDto) => {
          store.dispatch(setSettings(payload));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateImage(payload: TenantUpdateImageRequest): Promise<TenantDto> {
    const { tenant } = store.getState();
    const tenantId = tenant?.current?.id ?? "";
    return super.put(tenantId, payload, "UpdateImage");
  }
  delete(): Promise<void> {
    const { tenant } = store.getState();
    const tenantId = tenant?.current?.id ?? "";
    return super.delete(tenantId);
  }
  adminDelete(id: string): Promise<void> {
    return super.delete(id, "Admin/Delete");
  }
}
