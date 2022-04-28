/* eslint-disable @typescript-eslint/no-unused-vars */
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import { ILinkService } from "./ILinkService";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
import { FakeContractService } from "@/services/api/app/contracts/FakeContractService";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { CreateLinkRequest } from "@/application/contracts/core/links/CreateLinkRequest";
import { UpdateLinkRequest } from "@/application/contracts/core/links/UpdateLinkRequest";
import { FakeUserService } from "../users/FakeUserService";
import fakeCompanies from "./FakeCompanies";
import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";
import { Role } from "@/application/enums/shared/Role";

const fakeContractService = new FakeContractService();
const fakeUserService = new FakeUserService();

const providers: LinkDto[] = [];
for (let index = 1; index <= 10; index++) {
  const provider: LinkDto = {
    createdAt: new Date(),
    id: (index + 100).toString(),
    createdByUserId: fakeUserService.users[0].id,
    createdByUser: fakeUserService.users[0],
    createdByWorkspaceId: index === 1 ? "2" : "1",
    createdByWorkspace: {} as WorkspaceDto,
    providerWorkspaceId: (index - 1).toString(),
    providerWorkspace: {
      id: index.toString(),
      name: fakeCompanies[index - 1].name,
      businessMainActivity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PUBLIC,
      registrationNumber: "",
      registrationDate: undefined,
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    clientWorkspaceId: index.toString(),
    clientWorkspace: {
      id: (index + 1).toString(),
      name: fakeCompanies[index].name,
      businessMainActivity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PRIVATE,
      registrationNumber: "",
      registrationDate: undefined,
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    contracts: [],
    status: index <= 2 ? LinkStatus.PENDING : LinkStatus.LINKED,
  };
  // tslint:disable-next-line: max-line-length
  const contracts = fakeContractService.contracts.filter((f) => f.workspace?.name === provider.providerWorkspace.name);
  provider.contracts = contracts;
  providers.push(provider);
}

const clients: LinkDto[] = [];
for (let index = 1; index <= 10; index++) {
  const client: LinkDto = {
    id: (index + 200).toString(),
    createdAt: new Date(),
    createdByUserId: fakeUserService.users[0].id,
    createdByUser: fakeUserService.users[0],
    createdByWorkspaceId: index === 1 ? "1" : "2",
    createdByWorkspace: {} as WorkspaceDto,
    providerWorkspaceId: "1",
    providerWorkspace: {
      id: "1",
      name: fakeCompanies[index - 1].name,
      businessMainActivity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PUBLIC,
      registrationNumber: "",
      registrationDate: new Date(),
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    clientWorkspaceId: "2",
    clientWorkspace: {
      id: "2",
      name: fakeCompanies[index - 1].name,
      businessMainActivity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PRIVATE,
      registrationNumber: "",
      registrationDate: new Date(),
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    contracts: [],
    status: index <= 2 ? LinkStatus.PENDING : LinkStatus.LINKED,
  };
  // tslint:disable-next-line: max-line-length
  const contracts = fakeContractService.contracts.filter((f) => f.linkId === client.id);
  client.contracts = contracts;
  clients.push(client);
}

const links: LinkDto[] = [...providers, ...clients];

const invitations: LinkInvitationDto[] = [
  {
    id: "1",
    createdByUser: {
      email: "alex@company.com",
      firstName: "Alexandro",
      lastName: "Martinez",
    },
    createdByWorkspace: {
      name: "Tenant 1",
    },
    workspaceName: "WORKSPACE NAME",
    email: "pedro@company.com",
    message: "Sample message...",
    status: LinkStatus.PENDING,
    inviteeIsProvider: true,
  } as LinkInvitationDto,
  {
    id: "2",
    createdByUser: {
      email: "alex@company.com",
      firstName: "Alexandro",
      lastName: "Martinez",
    },
    createdByWorkspace: {
      name: "Tenant 1",
    },
    workspaceName: "WORKSPACE NAME",
    email: "pedro@company.com",
    message: "Sample message...",
    status: LinkStatus.PENDING,
    inviteeIsProvider: false,
  } as LinkInvitationDto,
];

export class FakeLinkService implements ILinkService {
  links: LinkDto[] = links;
  providers: LinkDto[] = providers;
  clients: LinkDto[] = clients;
  invitations: LinkInvitationDto[] = invitations;
  getAllLinked(): Promise<LinkDto[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(this.links.filter((f) => f.status === LinkStatus.LINKED));
      }, 500);
    });
  }
  getAllPending(): Promise<LinkDto[]> {
    return new Promise((resolve, _reject) => {
      const links = this.links.filter((f) => f.status === 0);
      setTimeout(() => {
        resolve(links);
      }, 500);
    });
  }
  getAllProviders(): Promise<LinkDto[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(this.providers.filter((f) => f.status === LinkStatus.LINKED));
      }, 500);
    });
  }
  getAllClients(): Promise<LinkDto[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(this.clients);
      }, 500);
    });
  }
  getLinkUsers(_linkId: string): Promise<WorkspaceUserDto[]> {
    const users: any[] = [];
    fakeUserService.users.forEach((element) => {
      users.push({
        id: undefined,
        userId: element.id,
        user: element,
        role: Role.MEMBER,
      });
    });
    return Promise.resolve(users);
  }
  getInvitation(id: string): Promise<LinkInvitationDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invitation = this.invitations.find((f) => f.id === id);
        if (invitation) {
          resolve(invitation);
        }
        reject();
      }, 500);
    });
  }
  createInvitation(payload: LinkInvitationDto): Promise<LinkInvitationDto> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        this.invitations.push(payload);
        resolve(payload);
      }, 500);
    });
  }
  rejectInvitation(_id: string): Promise<void> {
    return Promise.resolve();
  }
  searchUser(email: string): Promise<UserDto> {
    const fakeUsers: any[] = [];
    fakeNamesAndEmails.forEach((fakeEmail) => {
      fakeUsers.push({
        email: fakeEmail.email,
        firstName: fakeEmail.firstName,
        lastName: fakeEmail.lastName,
      });
    });
    const user = fakeUsers.find((f) => f.email === email);
    if (user) {
      return Promise.resolve(user);
    }
    return Promise.reject();
  }
  searchMember(email: string, _workspaceName: string): Promise<WorkspaceUserDto> {
    const fakeUsers: any[] = [];
    fakeNamesAndEmails.forEach((fakeEmail) => {
      fakeUsers.push({
        email: fakeEmail.email,
        firstName: fakeEmail.firstName,
        lastName: fakeEmail.lastName,
      });
    });
    const user = fakeUsers.find((f) => f.email === email);
    if (user) {
      return Promise.resolve(user);
    }
    return Promise.reject();
  }
  get(id: string): Promise<LinkDto> {
    const link = this.links.find((f) => f.id === id);
    if (link) {
      return Promise.resolve(link);
    } else {
      return Promise.reject();
    }
  }
  create(_data: CreateLinkRequest): Promise<LinkDto> {
    return Promise.resolve(this.links[0]);
  }
  acceptOrReject(id: string, data: UpdateLinkRequest): Promise<LinkDto> {
    const link = this.links.find((f) => f.id === id);
    if (link) {
      link.status = data.accepted ? LinkStatus.LINKED : LinkStatus.REJECTED;

      return Promise.resolve(link);
    }
    return Promise.reject();
  }
  delete(id: string): Promise<void> {
    const link = this.links.find((f) => f.id === id);
    if (link) {
      this.links = this.links.filter((f) => f.id !== id);
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}
