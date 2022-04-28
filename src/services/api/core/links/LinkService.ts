import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { ILinkService } from "./ILinkService";
import { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { CreateLinkRequest } from "@/application/contracts/core/links/CreateLinkRequest";
import { UpdateLinkRequest } from "@/application/contracts/core/links/UpdateLinkRequest";
import { ApiService } from "../../ApiService";

export class LinkService extends ApiService implements ILinkService {
  constructor() {
    super("Link");
  }
  getAllLinked(): Promise<LinkDto[]> {
    return super.getAll("GetAllLinked");
  }
  getAllPending(): Promise<LinkDto[]> {
    return new Promise((resolve, reject) => {
      return super
        .getAll("GetAllPending")
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getAllProviders(): Promise<LinkDto[]> {
    return super.getAll("GetAllProviders");
  }
  getAllClients(): Promise<LinkDto[]> {
    return super.getAll("GetAllClients");
  }
  getLinkUsers(linkId: string): Promise<WorkspaceUserDto[]> {
    return super.getAll("GetLinkUsers/" + linkId);
  }
  getInvitation(id: string): Promise<LinkInvitationDto> {
    return super.get("GetInvitation", id);
  }
  createInvitation(payload: LinkInvitationDto): Promise<LinkInvitationDto> {
    return super.post(payload, "CreateInvitation");
  }
  rejectInvitation(id: string): Promise<void> {
    return super.post(undefined, "RejectInvitation/" + id);
  }
  searchUser(email: string): Promise<UserDto> {
    return super.get(`SearchUser/${email}`);
  }
  searchMember(email: string, workspaceName: string): Promise<WorkspaceUserDto> {
    return super.get(`SearchMember/${email}/${workspaceName}`);
  }
  get(id: string): Promise<LinkDto> {
    return super.get("Get", id);
  }
  create(data: CreateLinkRequest): Promise<LinkDto> {
    return super.post(data, "Create");
  }
  acceptOrReject(id: string, data: UpdateLinkRequest): Promise<LinkDto> {
    return super.put(id, data, "AcceptOrReject");
  }
  delete(id: string): Promise<void> {
    return super.delete(id, "Delete");
  }
}
