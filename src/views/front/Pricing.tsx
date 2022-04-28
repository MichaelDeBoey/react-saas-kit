import Header from "@/components/front/Header";
import Plans from "@/components/front/Plans";
import Footer from "@/components/front/Footer";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Pricing() {
  const { t } = useTranslation();
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("front.pricing.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <Header />
        <div className="pt-6 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl">{t("front.pricing.title")}</h2>
              <p className="mt-4 text-lg leading-6 text-gray-500">{t("front.pricing.headline")}</p>
            </div>
            <Plans />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
