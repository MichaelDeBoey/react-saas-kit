import { useTranslation } from "react-i18next";
import AllComponentsList from "@/components/ui/AllComponentsList";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function AdminComponents() {
  const { t } = useTranslation();
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("admin.components.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">{t("admin.components.title")}</h1>
        </div>
      </div>
      <div className="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
        <AllComponentsList withSlideOvers={true} />
      </div>
    </div>
  );
}
