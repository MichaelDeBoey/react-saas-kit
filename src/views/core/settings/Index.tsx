import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs";

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname?.toString() === "/app/settings") {
    navigate("/app/settings/profile");
  }
  const tabs: TabItem[] = [
    {
      name: t("settings.profile.profileTitle"),
      routePath: "/app/settings/profile",
    },
    {
      name: t("models.workspace.plural"),
      routePath: "/app/settings/workspaces",
    },
    {
      name: t("settings.members.title"),
      routePath: "/app/settings/members",
    },
    {
      name: t("settings.subscription.title"),
      routePath: "/app/settings/subscription",
    },
    {
      name: t("settings.tenant.title"),
      routePath: "/app/settings/tenant",
    },
  ];
  return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex space-x-3 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Tabs tabs={tabs} className="flex-grow" />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
