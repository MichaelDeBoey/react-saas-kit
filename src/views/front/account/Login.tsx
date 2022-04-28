import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import Logo from "@/components/front/Logo";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import services from "@/services";
import UserUtils from "@/utils/store/UserUtils";
import { FormEvent, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const errorModal = useRef<RefErrorModal>(null);
  const loadingButton = useRef<RefLoadingButton>(null);

  const user = {} as UserLoginRequest;

  function signIn(e: FormEvent) {
    e.preventDefault();
    loadingButton.current?.start();
    services.authentication
      .login(user)
      .then((response: UserLoggedResponse) => {
        UserUtils.logged(response, navigate);
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        loadingButton.current?.stop();
      });
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("account.login.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">{t("account.login.title")}</h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              <span>{t("shared.or")} </span>
              <Link to="/pricing" className="font-medium text-theme-500 hover:text-theme-400">
                {t("account.login.orStartTrial", [90])}
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={signIn}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-sm shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("account.shared.email")}
                </label>
                <input
                  value={user.email}
                  onChange={(e) => {
                    user.email = e.target.value;
                  }}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-t-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  placeholder={t("account.shared.email")}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("account.shared.password")}
                </label>
                <input
                  value={user.password}
                  onChange={(e) => {
                    user.password = e.target.value;
                  }}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  placeholder={t("account.shared.password")}
                />
              </div>
            </div>

            <div>
              <LoadingButton ref={loadingButton} className="w-full block" type="submit">
                <span className="absolute left-0 inset-y pl-3">
                  <svg className="h-5 w-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {t("account.login.button")}
              </LoadingButton>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-theme-500 hover:text-theme-400">
                  {t("account.login.forgot")}
                </Link>
              </div>
            </div>
          </form>
          <ErrorModal ref={errorModal} />
        </div>
      </div>
    </div>
  );
}
