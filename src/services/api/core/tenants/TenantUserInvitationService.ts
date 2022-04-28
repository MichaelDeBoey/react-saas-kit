import store from "@/store";
import { ApiService } from "@/services/api/ApiService";
import { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { AuthenticationService } from "@/services/api/core/users/AuthenticationService";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import { ITenantUserInvitationService } from "./ITenantUserInvitationService";

export class TenantUserInvitationService extends ApiService implements ITenantUserInvitationService {
  constructor() {
    super("TenantUserInvitation");
  }

  getInvitation(tenantUserId: string): Promise<TenantInvitationResponse> {
    return super.get("GetInvitation", tenantUserId);
  }
  getInviteURL(linkUuid: string): Promise<TenantDto> {
    return super.get("GetInviteURL", linkUuid);
  }
  getInvitationSettings(tenantId = ""): Promise<TenantJoinSettingsDto> {
    const { tenant } = store.getState();
    if (!tenantId) {
      tenantId = tenant?.current?.id ?? "";
    }
    return super.get("GetInvitationSettings", tenantId);
  }
  inviteUser(invitation: UserInviteRequest): Promise<TenantUserDto> {
    return super.post(invitation, `InviteUser`);
  }
  requestAccess(linkUuid: string, payload: UserVerifyRequest): Promise<TenantUserDto> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, `RequestAccess/${linkUuid}`)
        .then((response: TenantUserDto) => {
          if (response.status === TenantUserStatus.ACTIVE) {
            const auth = new AuthenticationService();
            auth.login({
              email: payload.email,
              password: payload.password,
              loginType: payload.userLoginType,
            });
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  acceptUser(payload: TenantUserDto): Promise<void> {
    return super.post(payload, `AcceptUser/${payload.id}`);
  }
  acceptInvitation(tenantUserId: string, payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, `AcceptInvitation/${tenantUserId}`)
        .then((response: UserLoggedResponse) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateInvitationSettings(payload: TenantUpdateJoinSettingsRequest): Promise<TenantJoinSettingsDto> {
    return super.post(payload, `UpdateInvitationSettings`);
  }
}
