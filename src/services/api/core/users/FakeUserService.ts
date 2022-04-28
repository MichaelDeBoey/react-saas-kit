/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import { UserType } from "@/application/enums/core/users/UserType";

import store from "@/store";
import { setAvatar } from "@/store/modules/accountReducer";
import { logout } from "@/store/modules/authReducer";
import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";
import { FakeTenantService } from "../tenants/FakeTenantService";
import { IUserService } from "./IUserService";

const users: UserDto[] = [];
const fakeTenantService = new FakeTenantService();

for (let index = 0; index < 20; index++) {
  const user: UserDto = {
    id: (index + 1).toString(),
    type: index === 0 ? UserType.Admin : UserType.Tenant,
    email: fakeNamesAndEmails[index].email,
    firstName: fakeNamesAndEmails[index].firstName,
    lastName: fakeNamesAndEmails[index].lastName,
    phone: "",
    loginType: UserLoginType.PASSWORD,
    avatar: fakeNamesAndEmails[index].avatar,
    token: "",
    defaultTenant: fakeTenantService.tenants[0],
    defaultTenantId: 1,
    tenants: [fakeTenantService.tenants[0].users[0]],
    currentTenant: fakeTenantService.tenants[0],
    timezone: "",
    locale: "",
  };
  users.push(user);
}

export class FakeUserService implements IUserService {
  users = users;
  adminGetAll(): Promise<UserDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(users);
      }, 500);
    });
  }
  get(id: string): Promise<UserDto> {
    const user = this.users.find((f) => f.id === id);
    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject();
    }
  }
  updateAvatar(payload: UserUpdateAvatarRequest): Promise<UserDto> {
    return new Promise((resolve) => {
      store.dispatch(setAvatar(payload.avatar));
      const { account } = store.getState();
      if (account.user) {
        return resolve(account.user);
      }
    });
  }
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any> {
    return Promise.resolve(payload);
  }
  update(_id: string, _payload: UserUpdateRequest): Promise<UserDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updatePassword(_payload: UserUpdatePasswordRequest): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  adminUpdatePassword(_userId: string, _password: string): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updateDefaultTenant(_tenantId?: string): Promise<UserLoggedResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  deleteMe(): Promise<void> {
    store.dispatch(logout());
    return Promise.resolve();
  }
  adminDelete(_id: string): Promise<void> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
