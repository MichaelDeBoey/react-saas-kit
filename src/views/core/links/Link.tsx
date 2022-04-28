import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb";
import LinkProfile from "@/components/app/links/all/LinkProfile";

export default function Link() {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <div>
      <Breadcrumb menu={[{ title: t("models.link.plural"), routePath: "/app/links/all" }]} />
      {id && <LinkProfile id={id} />}
    </div>
  );
}
