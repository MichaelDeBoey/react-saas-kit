/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateWorkspaceRequest } from "@/application/contracts/core/workspaces/CreateWorkspaceRequest";
import { UpdateWorkspaceRequest } from "@/application/contracts/core/workspaces/UpdateWorkspaceRequest";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { Role } from "@/application/enums/shared/Role";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";

import store from "@/store";
import fakeCompanies from "../links/FakeCompanies";
import { IWorkspaceService } from "./IWorkspaceService";
import { setWorkspaces } from "@/store/modules/tenantReducer";
import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";

const workspaces: WorkspaceDto[] = [];

for (let index = 0; index < fakeCompanies.length; index++) {
  workspaces.push({
    id: (index + 1).toString(),
    tenant: undefined,
    name: fakeCompanies[index].name,
    businessMainActivity: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
    type: WorkspaceType.PUBLIC,
    registrationNumber: "",
    registrationDate: new Date(),
    createdAt: new Date(),
    users: [
      {
        workspaceId: "1",
        userId: "e9b2b8da-c72b-4b89-872b-81bc5b36a28f",
        role: Role.ADMINISTRATOR,
        default: false,
        id: "1c8a666d-ea0d-4a65-8d0c-d71e8b3c4879",
        user: fakeNamesAndEmails[0] as UserDto,
      },
    ],
  });
}

export class FakeWorkspaceService implements IWorkspaceService {
  workspaces = workspaces;
  getAllWorkspaces(saveInStore: boolean): Promise<WorkspaceDto[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        const workspaces = this.workspaces.filter((f) => f.type === WorkspaceType.PUBLIC).slice(0, 2);
        if (saveInStore) {
          store.dispatch(setWorkspaces(workspaces));
        }
        resolve(workspaces);
      }, 500);
    });
  }
  get(id: string): Promise<WorkspaceDto> {
    const workspace = this.workspaces.find((f) => f.id === id);
    if (workspace) {
      return Promise.resolve(workspace);
    } else {
      return Promise.reject();
    }
  }
  create(_data: CreateWorkspaceRequest): Promise<WorkspaceDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  update(_id: string, _data: UpdateWorkspaceRequest): Promise<WorkspaceDto> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  delete(_id: string): Promise<any> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
}
