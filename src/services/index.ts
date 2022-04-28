import { AuthenticationService } from "@/services/api/core/users/AuthenticationService";
import { TenantService } from "@/services/api/core/tenants/TenantService";
import { TenantUsersService } from "@/services/api/core/tenants/TenantUsersService";
import { UserService } from "@/services/api/core/users/UserService";
import { TenantUserInvitationService } from "@/services/api/core/tenants/TenantUserInvitationService";
import { SubscriptionProductService } from "./api/core/subscriptions/SubscriptionProductService";
import { SubscriptionManagerService } from "./api/core/subscriptions/SubscriptionManagerService";
import { WorkspaceService } from "./api/core/workspaces/WorkspaceService";
import { IContractService } from "./api/app/contracts/IContractService";
import { FakeContractService } from "./api/app/contracts/FakeContractService";
import { ContractService } from "./api/app/contracts/ContractService";
import { IUserService } from "./api/core/users/IUserService";
import { IAuthenticationService } from "./api/core/users/IAuthenticationService";
import { IWorkspaceService } from "./api/core/workspaces/IWorkspaceService";
import { FakeWorkspaceService } from "./api/core/workspaces/FakeWorkspaceService";
import { FakeUserService } from "./api/core/users/FakeUserService";
import { FakeEmployeeService } from "./api/app/employees/FakeEmployeeService";
import { EmployeeService } from "./api/app/employees/EmployeeService";
import { IEmployeeService } from "./api/app/employees/IEmployeeService";
import { FakeAuthenticationService } from "./api/core/users/FakeAuthenticationService";
import { ILinkService } from "./api/core/links/ILinkService";
import { FakeLinkService } from "./api/core/links/FakeLinkService";
import { LinkService } from "./api/core/links/LinkService";
import { ITenantService } from "./api/core/tenants/ITenantService";
import { FakeTenantService } from "./api/core/tenants/FakeTenantService";
import { ITenantUsersService } from "./api/core/tenants/ITenantUsersService";
import { FakeTenantUsersService } from "./api/core/tenants/FakeTenantUsersService";
import { ISubscriptionManagerService } from "./api/core/subscriptions/ISubscriptionManagerService";
import { FakeSubscriptionManagerService } from "./api/core/subscriptions/FakeSubscriptionManagerService";
import { ISubscriptionProductService } from "./api/core/subscriptions/ISubscriptionProductService";
import { FakeSubscriptionProductService } from "./api/core/subscriptions/FakeSubscriptionProductService";
import { ITenantUserInvitationService } from "./api/core/tenants/ITenantUserInvitationService";
import { FakeTenantUserInvitationService } from "./api/core/tenants/FakeTenantUserInvitationService";
import { ISetupService } from "./api/core/setup/ISetupService";
import { SetupService } from "./api/core/setup/SetupService";
import { FakeSetupService } from "./api/core/setup/FakeSetupService";

class Services {
  // Master: Subscriptions
  subscriptionProducts: ISubscriptionProductService;
  subscriptionManager: ISubscriptionManagerService;

  // Master: Users, Tenants and Workspaces
  authentication: IAuthenticationService;
  users: IUserService;
  tenants: ITenantService;
  tenantUsers: ITenantUsersService;
  tenantUserInvitations: ITenantUserInvitationService;
  workspaces: IWorkspaceService;

  // Setup
  setup: ISetupService;

  // App
  links: ILinkService;
  contracts: IContractService;
  employees: IEmployeeService;

  constructor() {
    if (import.meta.env.VITE_REACT_APP_SERVICE === "sandbox") {
      this.subscriptionProducts = new FakeSubscriptionProductService();
      this.subscriptionManager = new FakeSubscriptionManagerService();
      this.tenants = new FakeTenantService();
      this.tenantUsers = new FakeTenantUsersService();
      this.users = new FakeUserService();
      this.tenantUserInvitations = new FakeTenantUserInvitationService();
      this.authentication = new FakeAuthenticationService();
      this.workspaces = new FakeWorkspaceService();
      this.setup = new FakeSetupService();

      this.contracts = new FakeContractService();
      this.employees = new FakeEmployeeService();
      this.links = new FakeLinkService();
    } else {
      this.subscriptionProducts = new SubscriptionProductService();
      this.subscriptionManager = new SubscriptionManagerService();
      this.tenants = new TenantService();
      this.tenantUsers = new TenantUsersService();
      this.users = new UserService();
      this.tenantUserInvitations = new TenantUserInvitationService();
      this.authentication = new AuthenticationService();
      this.workspaces = new WorkspaceService();
      this.setup = new SetupService();

      this.contracts = new ContractService();
      this.employees = new EmployeeService();
      this.links = new LinkService();
    }
  }
}

export default new Services();
