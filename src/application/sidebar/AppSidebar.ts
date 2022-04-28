import i18n from "../../locale/i18n";
import { SideBarItem } from "./SidebarItem";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { UserType } from "@/application/enums/core/users/UserType";
import { SvgIcon } from "../enums/shared/SvgIcon";

export const AppSidebar: SideBarItem[] = [
  {
    title: i18n.t("app.sidebar.app"),
    path: "",
    items: [
      {
        title: i18n.t("app.sidebar.dashboard"),
        path: "/app/dashboard",
        icon: SvgIcon.DASHBOARD,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
      },
      {
        title: i18n.t("models.link.plural"),
        path: "/app/links/all",
        icon: SvgIcon.LINKS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
        items: [
          {
            title: i18n.t("shared.all"),
            path: "/app/links/all",
          },
          {
            title: i18n.t("models.provider.plural"),
            path: "/app/links/providers",
          },
          {
            title: i18n.t("models.client.plural"),
            path: "/app/links/clients",
          },
        ],
      },
      {
        title: i18n.t("models.contract.plural"),
        path: "/app/contracts/pending",
        icon: SvgIcon.CONTRACTS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
      },
      {
        title: i18n.t("models.employee.plural"),
        path: "/app/employees",
        icon: SvgIcon.EMPLOYEES,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
      },
      {
        title: i18n.t("app.navbar.settings"),
        icon: SvgIcon.SETTINGS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
        path: "/app/settings",
        items: [
          {
            title: i18n.t("app.navbar.profile"),
            path: "/app/settings/profile",
          },
          {
            title: i18n.t("models.workspace.plural"),
            path: "/app/settings/workspaces",
            userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          {
            title: i18n.t("settings.members.title"),
            path: "/app/settings/members",
            userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          {
            title: i18n.t("settings.subscription.title"),
            path: "/app/settings/subscription",
            userRoles: [TenantUserRole.OWNER],
          },
          {
            title: i18n.t("app.navbar.tenant"),
            path: "/app/settings/tenant",
            userRoles: [TenantUserRole.OWNER],
          },
        ],
      },
    ],
  },
  {
    title: i18n.t("admin.title"),
    path: "",
    items: [
      {
        title: i18n.t("admin.switchToAdmin"),
        path: "/admin/tenants",
        icon: SvgIcon.ADMIN,
        userTypes: [UserType.Admin],
      },
    ],
  },
];
