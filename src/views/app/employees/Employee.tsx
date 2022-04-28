import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmployeeProfile from "@/components/app/employees/EmployeeProfile";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Employee() {
  const { t } = useTranslation();

  const { id } = useParams();

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("models.employee.object")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <Breadcrumb menu={[{ title: t("models.employee.plural"), routePath: "/app/employees" }]} />
      <EmployeeProfile id={id ?? ""} />
    </div>
  );
}
