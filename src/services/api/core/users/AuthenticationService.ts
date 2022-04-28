import store from "@/store";
import { ApiService } from "@/services/api/ApiService";
import { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { IAuthenticationService } from "./IAuthenticationService";
import { login, logout } from "@/store/modules/authReducer";

export class AuthenticationService extends ApiService implements IAuthenticationService {
  constructor() {
    super("Authentication");
  }
  login(payload: UserLoginRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Login")
        .then((response: UserLoggedResponse) => {
          store.dispatch(login(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  impersonate(userId: string): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, `Admin/Impersonate/${userId}`)
        .then((response: UserLoggedResponse) => {
          store.dispatch(logout());
          store.dispatch(login(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  register(payload: UserRegisterRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Register")
        .then((response: UserLoggedResponse) => {
          if (response && response.user) {
            store.dispatch(login(response));
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  verify(payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Verify")
        .then((response: UserLoggedResponse) => {
          store.dispatch(login(response));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  reset(email: string): Promise<any> {
    return super.post(null, "Reset/" + email);
  }
}
