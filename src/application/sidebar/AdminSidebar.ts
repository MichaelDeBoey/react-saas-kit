import { SideBarItem } from "./SidebarItem";
import i18n from "@/locale/i18n";
import { UserType } from "@/application/enums/core/users/UserType";
import { SvgIcon } from "../enums/shared/SvgIcon";

export const AdminSidebar: SideBarItem[] = [
  {
    title: i18n.t("app.sidebar.admin"),
    path: "",
    items: [
      {
        title: i18n.t("admin.tenants.title"),
        path: "/admin/tenants",
        icon: SvgIcon.TENANTS,
        items: [],
      },
      {
        title: i18n.t("models.user.plural"),
        path: "/admin/users",
        icon: SvgIcon.USERS,
        items: [],
      },
      {
        title: i18n.t("admin.pricing.title"),
        path: "/admin/pricing",
        icon: SvgIcon.PRICING,
        items: [],
      },
      {
        title: i18n.t("admin.emails.title"),
        path: "/admin/emails",
        icon: SvgIcon.EMAILS,
        items: [],
      },
      {
        title: i18n.t("admin.navigation.title"),
        path: "/admin/navigation",
        icon: SvgIcon.NAVIGATION,
        items: [],
      },
      {
        title: i18n.t("admin.components.title"),
        path: "/admin/components",
        icon: SvgIcon.COMPONENTS,
        items: [],
      },
    ],
  },
  {
    title: "App",
    path: "",
    items: [
      {
        title: i18n.t("admin.switchToApp"),
        path: "/app",
        icon: SvgIcon.APP,
        userTypes: [UserType.Admin],
        items: [],
      },
    ],
  },
];
