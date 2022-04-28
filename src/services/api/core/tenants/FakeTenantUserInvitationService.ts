/* eslint-disable @typescript-eslint/no-unused-vars */
import { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";
import { ITenantUserInvitationService } from "./ITenantUserInvitationService";
import { FakeTenantUsersService } from "./FakeTenantUsersService";
import { FakeTenantService } from "./FakeTenantService";

const fakeTenantUsersService = new FakeTenantUsersService();
const fakeTenantService = new FakeTenantService();
const invitation: TenantInvitationResponse = {
  invitation: fakeTenantUsersService.tenantUsers[0],
  tenant: fakeTenantService.tenants[0],
  requiresVerify: true,
};

export class FakeTenantUserInvitationService implements ITenantUserInvitationService {
  getInvitation(_tenantUserId: string): Promise<TenantInvitationResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(invitation);
      }, 500);
    });
  }
  getInviteURL(_linkUuid: string): Promise<TenantDto> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(invitation.tenant);
      }, 500);
    });
  }
  getInvitationSettings(_tenantId?: string): Promise<TenantJoinSettingsDto> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve({
          id: "",
          tenantId: "",
          tenant: {} as TenantDto,
          link: "",
          linkActive: false,
          publicUrl: false,
          requireAcceptance: false,
        });
      }, 500);
    });
  }
  inviteUser(_invitation: UserInviteRequest): Promise<TenantUserDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  requestAccess(_linkUuid: string, _payload: UserVerifyRequest): Promise<TenantUserDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  acceptUser(_payload: TenantUserDto): Promise<void> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  acceptInvitation(_tenantUserId: string, _payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  updateInvitationSettings(_payload: TenantUpdateJoinSettingsRequest): Promise<TenantJoinSettingsDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
