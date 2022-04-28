import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";

export interface IAuthenticationService {
  login(payload: UserLoginRequest): Promise<UserLoggedResponse>;
  impersonate(userId: string): Promise<UserLoggedResponse>;
  register(payload: UserRegisterRequest): Promise<UserLoggedResponse>;
  verify(payload: UserVerifyRequest): Promise<UserLoggedResponse>;
  reset(email: string): Promise<any>;
}
