import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import Logo from "@/components/front/Logo";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import services from "@/services";
import classNames from "@/utils/shared/ClassesUtils";
import UserUtils from "@/utils/store/UserUtils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Verify() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const search = useLocation().search;
  const emailQueryParam = new URLSearchParams(search).get("e") ?? "";
  const tokenQueryParam = new URLSearchParams(search).get("t") ?? "";

  const loadingButton = useRef<RefLoadingButton>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const requireName = false;
  const requirePassword = true;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setEmail(emailQueryParam);
    setToken(tokenQueryParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function verify(e: FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      errorModal.current?.show(t("account.login.errors.passwordMissmatch"));
      return;
    }

    const verify: UserVerifyRequest = {
      email,
      password,
      passwordConfirm,
      token,
    } as UserVerifyRequest;

    loadingButton.current?.start();
    services.authentication
      .verify(verify)
      .then((response) => {
        UserUtils.logged(response, navigate);
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        if (loadingButton.current) {
          loadingButton.current?.stop();
        }
      });
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("account.verify.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div>
        <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
          <Logo className="mx-auto h-12 w-auto" />
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">{t("account.verify.title")}</h2>
            <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
              {t("account.register.alreadyRegistered")}{" "}
              <span className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                <Link to="/login">{t("account.register.clickHereToLogin")}</Link>
              </span>
            </p>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="sm:rounded-sm sm:px-10">
                <form onSubmit={verify}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                      {t("account.shared.email")}
                    </label>
                    <div className="mt-1 rounded-sm shadow-sm">
                      <input
                        disabled
                        className={classNames(
                          "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                          "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                        )}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        type="email"
                        required
                      />
                    </div>
                  </div>
                  {requireName && (
                    <div className="mt-6">
                      <label htmlFor="firstName" className="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                        {t("account.register.firstName")}
                      </label>
                      <div className="mt-1 rounded-sm shadow-sm">
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          id="firstName"
                          type="text"
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {requireName && (
                    <div className="mt-6">
                      <label htmlFor="lastName" className="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                        {t("account.register.lastName")}
                      </label>
                      <div className="mt-1 rounded-sm shadow-sm">
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          id="lastName"
                          type="text"
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {requirePassword && (
                    <div className="mt-6">
                      <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                        {t("account.shared.password")}
                      </label>
                      <div className="mt-1 rounded-sm shadow-sm">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="password"
                          type="password"
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {requirePassword && (
                    <div className="mt-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium leading-5 text-gray-900 dark:text-slate-300">
                        {t("account.register.confirmPassword")}
                      </label>
                      <div className="mt-1 rounded-sm shadow-sm">
                        <input
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          id="confirmPassword"
                          type="password"
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <span className="block w-full rounded-sm shadow-sm">
                      <LoadingButton ref={loadingButton} className="w-full block" type="submit">
                        {t("account.verify.button")}
                      </LoadingButton>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ErrorModal ref={errorModal} />
      </div>
    </div>
  );
}
