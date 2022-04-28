import { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import Logo from "@/components/front/Logo";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import services from "@/services";
import store from "@/store";
import { login } from "@/store/modules/authReducer";
import UserUtils from "@/utils/store/UserUtils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Invitation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const search = useLocation().search;
  const emailQueryParam = new URLSearchParams(search).get("e");
  const invitationQueryParam = new URLSearchParams(search).get("i");

  const loadingButton = useRef<RefLoadingButton>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [requirePassword, setRequirePassword] = useState(true);
  const [invitation, setInvitation] = useState<TenantUserDto | null>(null);
  const [tenant, setTenant] = useState<TenantDto>({} as TenantDto);

  useEffect(() => {
    setToken(invitationQueryParam?.toString() ?? "");
    setEmail(emailQueryParam?.toString() ?? "");

    if (invitationQueryParam) {
      setLoading(true);
      services.tenantUserInvitations
        .getInvitation(invitationQueryParam)
        .then((response: TenantInvitationResponse) => {
          setInvitation(response.invitation);
          setTenant(response.tenant);
          setRequirePassword(response.requiresVerify);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function accept(e: FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      errorModal.current?.show(t("api.errors.passwordMismatch"));
      return;
    }

    loadingButton.current?.start();
    services.tenantUserInvitations
      .acceptInvitation(invitationQueryParam ?? "", {
        email,
        token,
        password,
        passwordConfirm,
      })
      .then((response) => {
        store.dispatch(login(response));
        UserUtils.logged(response, navigate);
        window.location.reload();
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
        if (loadingButton.current) {
          loadingButton.current?.stop();
        }
      });
  }
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("account.invitation.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {(() => {
              if (tenant && (tenant.logo || tenant.logoDarkmode)) {
                return (
                  <div>
                    <Link to="/">
                      <img alt="Logo" src={tenant.logo} className="mx-auto h-16 w-auto" />
                    </Link>
                  </div>
                );
              } else {
                return <Logo className="mx-auto h-12 w-auto" />;
              }
            })()}
          </div>
          {(() => {
            if (loading) {
              return <div></div>;
            } else if (!invitation || !invitation.user) {
              return <div className="text-red-500 text-center">{t("shared.invalidInvitation")}</div>;
            } else {
              return (
                <div>
                  <h2 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
                    {t("shared.hi")} {invitation.user.firstName ? invitation.user.firstName : invitation.user.email}, {t("account.invitation.youWereInvited")}{" "}
                    {invitation.tenant.name}
                  </h2>
                  <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                    {t("account.register.alreadyRegistered")}{" "}
                    <span className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                      <Link to="/login">{t("account.register.clickHereToLogin")}</Link>
                    </span>
                  </p>

                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="py-8 px-4 sm:rounded-sm sm:px-10">
                      <form onSubmit={accept} className="sm:w-96">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-5">
                            {t("account.shared.email")}
                          </label>
                          <div className="mt-1 rounded-sm shadow-sm">
                            <input
                              disabled={true}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              id="email"
                              type="email"
                              required
                              className="bg-gray-100 dark:bg-slate-800 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                          </div>
                        </div>
                        {requirePassword && (
                          <div className="mt-6">
                            <label htmlFor="password" className="block text-sm font-medium leading-5">
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-5">
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
                            <LoadingButton className="w-full block" type="submit" ref={loadingButton}>
                              {t("account.invitation.button")}
                            </LoadingButton>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
        <ErrorModal ref={errorModal} />
      </div>
    </div>
  );
}
