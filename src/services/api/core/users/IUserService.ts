import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import { UserDto } from "@/application/dtos/core/users/UserDto";

export interface IUserService {
  adminGetAll(): Promise<UserDto[]>;
  updateAvatar(avatar: UserUpdateAvatarRequest): Promise<UserDto>;
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any>;
  update(id: string, payload: UserUpdateRequest): Promise<UserDto>;
  updatePassword(payload: UserUpdatePasswordRequest): Promise<any>;
  adminUpdatePassword(userId: string, password: string): Promise<any>;
  updateDefaultTenant(tenantId?: string): Promise<UserLoggedResponse>;
  deleteMe(): Promise<void>;
  adminDelete(id: string): Promise<void>;
}
