import { useTranslation } from "react-i18next";
import Header from "@/components/front/Header";
import Icon from "@/components/front/Icon";
import { Link } from "react-router-dom";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Header />
      <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
        <div className="relative h-full max-w-7xl mx-auto">
          <svg
            className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200 dark:text-gray-800" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg
            className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2 text-gray-200 dark:text-gray-800"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
          </svg>
        </div>
      </div>
      <div className="relative z-10 px-6 pt-16 md:pt-24 pb-16 md:pb-24 space-y-3">
        <Icon className="hidden lg:flex mx-auto h-9 w-auto" />
        <h1 className="relative z-10 pb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black tracking-snug text-center leading-11 sm:leading-15 md:leading-18 lg:leading-22 text-gray-800 dark:text-white">
          <span className="flex space-x-4 justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-theme-400 to-theme-700">{t("front.hero.headline1")}</span>
            <span>{t("front.hero.headline2")}</span>
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-700">{t("front.hero.headline3")}</span>
        </h1>
        <div className="relative z-10 pb-10 text-gray-500 text-lg md:text-2xl text-center leading-normal md:leading-9">
          <p className="sm:text-lg max-w-2xl mx-auto">{t("front.hero.headline4")}</p>
        </div>

        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-theme-800 text-theme-100 hover:bg-theme-900 md:py-4 md:text-lg md:px-10"
            >
              {t("front.hero.start")}
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              to="/contact"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-theme-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              {t("front.hero.contact")}
            </Link>
          </div>
        </div>

        <p className="text-gray-500 flex justify-center">{t("front.hero.startHint")}</p>
      </div>
    </div>
  );
}
