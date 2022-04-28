import { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";

export interface ITenantUserInvitationService {
  getInvitation(tenantUserId: string): Promise<TenantInvitationResponse>;
  getInviteURL(linkUuid: string): Promise<TenantDto>;
  getInvitationSettings(tenantId?: string): Promise<TenantJoinSettingsDto>;
  inviteUser(invitation: UserInviteRequest): Promise<TenantUserDto>;
  requestAccess(linkUuid: string, payload: UserVerifyRequest): Promise<TenantUserDto>;
  acceptUser(payload: TenantUserDto): Promise<void>;
  acceptInvitation(tenantUserId: string, payload: UserVerifyRequest): Promise<UserLoggedResponse>;
  updateInvitationSettings(payload: TenantUpdateJoinSettingsRequest): Promise<TenantJoinSettingsDto>;
}
