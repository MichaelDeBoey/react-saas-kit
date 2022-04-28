/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import store from "@/store";
import { FakeWorkspaceService } from "../workspaces/FakeWorkspaceService";
import { FakeTenantService } from "../tenants/FakeTenantService";
import { FakeUserService } from "./FakeUserService";
import { IAuthenticationService } from "./IAuthenticationService";
import { login } from "@/store/modules/authReducer";

const fakeUserService = new FakeUserService();
const fakeWorkspaceService = new FakeWorkspaceService();
const fakeTenantService = new FakeTenantService();

const defaultWorkspace = fakeWorkspaceService.workspaces[0];
defaultWorkspace.tenant = fakeTenantService.tenants[0];

const userLoggedResponse: UserLoggedResponse = {
  user: fakeUserService.users[0],
  token: "",
  defaultWorkspace,
};

export class FakeAuthenticationService implements IAuthenticationService {
  login(_payload: UserLoginRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(userLoggedResponse);
      }, 500);
    });
  }
  impersonate(_userId: string): Promise<UserLoggedResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  register(_payload: UserRegisterRequest): Promise<UserLoggedResponse> {
    return this.login({} as UserLoginRequest);
  }
  verify(_payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  reset(_email: string): Promise<any> {
    return Promise.resolve();
  }
}
