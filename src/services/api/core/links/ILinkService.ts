import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { UpdateLinkRequest } from "@/application/contracts/core/links/UpdateLinkRequest";
import { CreateLinkRequest } from "@/application/contracts/core/links/CreateLinkRequest";
import { CreateLinkInvitationRequest } from "@/application/contracts/core/links/CreateLinkInvitationRequest";

export interface ILinkService {
  getAllLinked(): Promise<LinkDto[]>;
  getAllPending(): Promise<LinkDto[]>;
  getAllProviders(): Promise<LinkDto[]>;
  getAllClients(): Promise<LinkDto[]>;
  getLinkUsers(linkId: string): Promise<WorkspaceUserDto[]>;
  getInvitation(id: string): Promise<LinkInvitationDto>;
  createInvitation(payload: CreateLinkInvitationRequest): Promise<LinkInvitationDto>;
  rejectInvitation(id: string): Promise<void>;
  searchUser(email: string): Promise<UserDto>;
  searchMember(email: string, _workspaceName: string): Promise<WorkspaceUserDto>;
  get(id: string): Promise<LinkDto>;
  create(data: CreateLinkRequest): Promise<LinkDto>;
  acceptOrReject(id: string, data: UpdateLinkRequest): Promise<LinkDto>;
  delete(id: string): Promise<void>;
}
