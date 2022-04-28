import TenantProfile from "@/components/core/tenants/TenantProfile";
import TenantSubscription from "@/components/core/tenants/TenantSubscription";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export default function AdminTenant() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selected, setSelected] = useState(0);

  const tabs: TabItem[] = [
    {
      name: t("admin.tenants.profile.title"),
    },
    {
      name: t("admin.tenants.subscription.title"),
    },
  ];

  function selectedTab(idx) {
    setSelected(Number(idx));
  }

  return (
    <div>
      <Breadcrumb home="/admin" menu={[{ title: t("models.tenant.plural"), routePath: "/admin/tenants" }]}></Breadcrumb>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-3 px-8 h-13">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between">
          <Tabs asLinks={false} tabs={tabs} onSelected={selectedTab} className="flex-grow" />
        </div>
      </div>
      <div>
        {selected === 0 && <TenantProfile id={id} />}
        {selected === 1 && <TenantSubscription id={id} />}
      </div>
    </div>
  );
}
