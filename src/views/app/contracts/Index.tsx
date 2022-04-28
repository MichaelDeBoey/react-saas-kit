import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
import ContractsList from "@/components/app/contracts/ContractsList";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Tabs from "@/components/ui/tabs/Tabs";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export default function Contracts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status } = useParams();

  const tabs = [
    {
      name: t("shared.all"),
      routePath: "/app/contracts/all",
    },
    {
      name: t("app.contracts.pending.title"),
      routePath: "/app/contracts/pending",
    },
    {
      name: t("app.contracts.signed.title"),
      routePath: "/app/contracts/signed",
    },
    {
      name: t("app.contracts.archived.title"),
      routePath: "/app/contracts/archived",
    },
  ];
  const [filter, setFilter] = useState<ContractStatusFilter>(ContractStatusFilter.ALL);

  useEffect(() => {
    changeContractsStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function changeContractsStatus() {
    switch (status) {
      case "pending":
        setFilter(ContractStatusFilter.PENDING);
        break;
      case "signed":
        setFilter(ContractStatusFilter.SIGNED);
        break;
      case "archived":
        setFilter(ContractStatusFilter.ARCHIVED);
        break;
      case "all":
        setFilter(ContractStatusFilter.ALL);
        break;
      default:
        navigate("/app/contracts/pending");
        break;
    }
  }
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("models.contract.plural")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">{t("models.contract.plural")}</h1>
          <div className="flex items-center">
            <ButtonPrimary to="/app/contract/new">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:block">{t("app.contracts.new.title")}</span>
              <span className="lg:hidden">{t("shared.new")}</span>
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <Tabs tabs={tabs} className="flex-grow" />
        </div>
      </div>
      <div className="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContractsList filter={filter} key={filter} />
      </div>
    </div>
  );
}
