import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb";
import ContractDetails from "@/components/app/contracts/ContractDetails";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Contract() {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("models.contract.object")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <Breadcrumb
        menu={[
          {
            title: t("app.contracts.title"),
            routePath: "/app/contracts/pending",
          },
        ]}
      ></Breadcrumb>
      <div className="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
        <ContractDetails id={id ?? ""} />
      </div>
    </div>
  );
}
