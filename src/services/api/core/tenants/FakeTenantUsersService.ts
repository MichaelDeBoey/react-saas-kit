/* eslint-disable @typescript-eslint/no-unused-vars */
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantUserUpdateRequest } from "@/application/contracts/core/tenants/TenantUserUpdateRequest";
import { ITenantUsersService } from "./ITenantUsersService";
import { FakeTenantService } from "./FakeTenantService";

const fakeTenantService = new FakeTenantService();
const tenantUsers: TenantUserDto[] = [];
fakeTenantService.tenants.forEach((element) => {
  element.users.forEach((user) => {
    tenantUsers.push(user);
  });
});

export class FakeTenantUsersService implements ITenantUsersService {
  tenantUsers: TenantUserDto[] = tenantUsers;
  getAll(): Promise<TenantUserDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.tenantUsers);
      }, 500);
    });
  }
  get(tenantUserId: string): Promise<TenantUserDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.tenantUsers.find((f) => f.id === tenantUserId);
        if (user) {
          resolve(user);
        }
        reject();
      }, 500);
    });
  }
  update(tenantUserId: string, payload: TenantUserUpdateRequest): Promise<TenantUserDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.tenantUsers.find((f) => f.id === tenantUserId);
        if (user) {
          user.role = payload.role;
          user.phone = payload.phone;
          resolve(user);
        }
        reject();
      }, 500);
    });
  }
  delete(tenantUserId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.tenantUsers.find((f) => f.id === tenantUserId);
        if (user) {
          this.tenantUsers = this.tenantUsers.filter((f) => f.id !== user.id);
        }
        resolve(true);
      }, 500);
    });
  }
}
