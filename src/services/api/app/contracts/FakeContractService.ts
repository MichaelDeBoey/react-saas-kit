/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import { IContractService } from "./IContractService";
import { CreateContractRequest } from "@/application/contracts/app/contracts/CreateContractRequest";
import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";
import { SendContractRequest } from "@/application/contracts/app/contracts/SendContractRequest";
import { ContractActivityDto } from "@/application/dtos/app/contracts/ContractActivityDto";
import { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
import { ContractMemberDto } from "@/application/dtos/app/contracts/ContractMemberDto";
import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import { ContractEmployeeDto } from "@/application/dtos/app/contracts/ContractEmployeeDto";
import FakePdfBase64 from "./FakePdfBase64";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { FakeUserService } from "../../core/users/FakeUserService";
import { UpdateContractRequest } from "@/application/contracts/app/contracts/UpdateContractRequest";
import store from "@/store";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import { FakeEmployeeService } from "../employees/FakeEmployeeService";
import fakeCompanies from "../../core/links/FakeCompanies";
import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import i18n from "@/locale/i18n";

const userService = new FakeUserService();
const fakeEmployeeService = new FakeEmployeeService();

const users: UserDto[] = userService.users;
const contracts: ContractDto[] = [];

// MEMBERS
const members: ContractMemberDto[] = [
  {
    id: "",
    userId: userService.users[0].id,
    user: userService.users[0],
    role: ContractMemberRole.SIGNATORY,
    contractId: "",
    contract: {} as ContractDto,
    signDate: undefined,
  },
  {
    id: "",
    userId: userService.users[1].id,
    user: userService.users[1],
    role: ContractMemberRole.SIGNATORY,
    contractId: "",
    contract: {} as ContractDto,
  },
  {
    id: "",
    userId: userService.users[2].id,
    user: userService.users[2],
    role: ContractMemberRole.SPECTATOR,
    contractId: "",
    contract: {} as ContractDto,
  },
];

// EMPLOYEES
const employees: ContractEmployeeDto[] = [];
for (let index = 1; index <= 10; index++) {
  const employee: ContractEmployeeDto = {
    id: (index + 1).toString(),
    createdAt: new Date(),
    employeeId: "",
    employee: {
      id: "",
      firstName: fakeEmployeeService.employees[index - 1].firstName,
      lastName: fakeEmployeeService.employees[index - 1].lastName,
      email: fakeEmployeeService.employees[index - 1].email,
    },
  };
  employees.push(employee);
}

// CONTRACTS
const contractStatus = [ContractStatus.PENDING, ContractStatus.SIGNED, ContractStatus.SIGNED, ContractStatus.ARCHIVED];
// tslint:disable-next-line: max-line-length
const activityTypes = [ContractActivityType.CREATED];
for (let idxContract = 0; idxContract < contractStatus.length; idxContract++) {
  const status = contractStatus[idxContract];
  const activity: ContractActivityDto[] = [];
  for (let idxActivity = 0; idxActivity < activityTypes.length; idxActivity++) {
    const type = activityTypes[idxActivity];
    const today = new Date();
    const createdAt = new Date(today.setDate(today.getMonth() + idxActivity));
    activity.push({
      id: idxActivity,
      contractId: "",
      contract: {} as ContractDto,
      type,
      createdAt,
      createdByUser: users[0],
    });
  }
  const today = new Date();
  const createdAt = new Date(today.setDate(today.getDate() + idxContract));

  const contract: ContractDto = {
    id: (idxContract + 1).toString(),
    createdAt,
    createdByUser: users[0],
    name: i18n.t("models.contract.object") + " " + (idxContract + 1),
    linkId: (idxContract + 100).toString(),
    link: {
      id: (idxContract + 100).toString(),
      createdAt: new Date(),
      createdByUserId: "",
      createdByUser: {} as UserDto,
      createdByWorkspaceId: "",
      createdByWorkspace: {} as WorkspaceDto,
      status: LinkStatus.LINKED,
      providerWorkspaceId: "1",
      providerWorkspace: {
        id: "1",
        name: fakeCompanies[idxContract].name,
        businessMainActivity: "",
        type: WorkspaceType.PUBLIC,
        registrationNumber: "",
        registrationDate: new Date(),
        users: [],
      },
      clientWorkspaceId: "2",
      clientWorkspace: {
        id: "2",
        name: fakeCompanies[idxContract + 1].name,
        businessMainActivity: "",
        type: WorkspaceType.PRIVATE,
        registrationNumber: "",
        registrationDate: new Date(),
        users: [],
      },
    },
    hasFile: true,
    status,
    signedDate: status === ContractStatus.SIGNED ? new Date() : undefined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    employees,
    members,
    activity,
  };
  contracts.push(contract);
}

export class FakeContractService implements IContractService {
  contracts: ContractDto[] = contracts;
  getAllByStatusFilter(status: ContractStatusFilter): Promise<ContractDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let contracts = this.contracts;
        if (status !== ContractStatusFilter.ALL) {
          contracts = this.contracts.filter((f) => Number(f.status) === Number(status));
        }
        resolve(contracts);
      }, 500);
    });
  }
  getAllByLink(linkId: string): Promise<ContractDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contracts = this.contracts.filter((f) => f.linkId === linkId);
        resolve(contracts);
      }, 500);
    });
  }
  getContract(id: string): Promise<ContractDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const contract = this.contracts.find((f) => f.id?.toString() === id);
        if (contract) {
          resolve(contract);
        } else {
          reject();
        }
      }, 500);
    });
  }
  create(data: CreateContractRequest): Promise<ContractDto> {
    const { account } = store.getState();
    const contract: ContractDto = {
      id: this.contracts.length + 1 + "",
      name: data.name,
      description: data.description,
      linkId: data.linkId,
      link: {} as LinkDto,
      hasFile: true,
      status: ContractStatus.PENDING,
      members: [],
      employees: [],
      activity: [],
      createdAt: new Date(),
      createdByUserId: account.user?.id ?? "",
      createdByUser: account.user?.id ?? undefined,
    };
    contract.members = [];
    data.members.forEach((addMember) => {
      contract.members.push({
        id: "",
        role: addMember.role,
        contractId: contract.id,
        contract,
        userId: users[0].id,
        user: users[0],
        signDate: undefined,
      });
    });

    contract.employees = [];
    data.employees.forEach((employee) => {
      contract.employees.push({
        id: "",
        employeeId: employee.id,
        employee,
      });
    });

    contract.activity.push({
      id: "",
      contractId: contract.id,
      contract,
      type: ContractActivityType.CREATED,
      createdAt: new Date(),
      createdByUserId: account.user?.id ?? "",
      createdByUser: account.user ?? undefined,
    });

    this.contracts.push(contract);
    return Promise.resolve(contract);
  }
  downloadFile(id: string): Promise<any> {
    const contract = this.contracts.find((f) => f.id?.toString() === id);
    if (contract) {
      return Promise.resolve(FakePdfBase64);
    } else {
      return Promise.reject();
    }
  }
  downloadAddendum(_id: string, _listId: string): Promise<string> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  send(_id: string, _request: SendContractRequest): Promise<any> {
    return Promise.resolve(true);
  }
  update(id: string, data: UpdateContractRequest): Promise<ContractDto> {
    const contract = this.contracts.find((f) => f.id?.toString() === id);
    if (contract) {
      if (data.name) {
        contract.name = data.name;
      }
      if (data.description) {
        contract.description = data.description;
      }
      if (data.file) {
        contract.hasFile = true;
      }
      return Promise.resolve(contract);
    } else {
      return Promise.reject();
    }
  }
  delete(id: string): Promise<any> {
    this.contracts = this.contracts.filter((f) => f.id !== id);
    return Promise.resolve(this.contracts);
  }
}
