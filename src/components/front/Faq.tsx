import { useTranslation } from "react-i18next";

export default function Faq() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:py-8 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-slate-200 text-center">{t("front.faq.title")}</h2>
      <p className="text-center mt-4 text-lg leading-6 text-gray-500">{t("front.faq.headline")}</p>
      <div className="mt-12">
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q1")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a1")}</dd>
          </div>

          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q2")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a2")}</dd>
          </div>

          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q3")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a3")}</dd>
          </div>

          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q4")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a4")}</dd>
          </div>

          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q5")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a5")}</dd>
          </div>

          <div>
            <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">{t("front.faq.questions.q6")}</dt>
            <dd className="mt-2 text-base text-gray-500">{t("front.faq.questions.a6")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
