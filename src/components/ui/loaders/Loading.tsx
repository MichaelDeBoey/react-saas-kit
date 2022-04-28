import { useTranslation } from "react-i18next";

export default function Loading() {
  const sandbox = import.meta.env.VITE_REACT_APP_SERVICE === "sandbox";

  const { t } = useTranslation();
  return (
    <div className="pt-4 space-y-2 pb-4 text-center">
      <div className="h-auto w-full flex justify-center py-12 flex-col text-center space-y-4">
        {sandbox && <div className="font-medium italic text-sm">{t("shared.fakeLoading")}...</div>}
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-slate-200 h-20 w-20 mx-auto"></div>
      </div>
    </div>
  );
}
