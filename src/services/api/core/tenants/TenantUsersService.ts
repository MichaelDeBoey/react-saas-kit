import store from "@/store";
import { ApiService } from "@/services/api/ApiService";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantUserUpdateRequest } from "@/application/contracts/core/tenants/TenantUserUpdateRequest";
import { ITenantUsersService } from "./ITenantUsersService";
import { setMembers } from "@/store/modules/tenantReducer";

export class TenantUsersService extends ApiService implements ITenantUsersService {
  constructor() {
    super("TenantUsers");
  }
  getAll(): Promise<TenantUserDto[]> {
    return new Promise((resolve, reject) => {
      super
        .getAll("GetAll")
        .then((response: TenantUserDto[]) => {
          store.dispatch(setMembers(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  get(tenantUserId: string): Promise<TenantUserDto> {
    return super.get("Get", `${tenantUserId}`);
  }
  update(tenantUserId: string, payload: TenantUserUpdateRequest): Promise<TenantUserDto> {
    return super.put(`${tenantUserId}`, payload);
  }
  delete(tenantUserId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super
        .delete(tenantUserId)
        .then((response) => {
          this.getAll();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
