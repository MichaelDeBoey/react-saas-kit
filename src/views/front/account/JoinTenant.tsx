import { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import Logo from "@/components/front/Logo";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import services from "@/services";
import store, { RootState } from "@/store";
import { logout } from "@/store/modules/authReducer";
import classNames from "@/utils/shared/ClassesUtils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

export default function JoinTenant() {
  const { t } = useTranslation();

  const params = useParams();
  const search = useLocation().search;
  const emailQueryParam = new URLSearchParams(search).get("e");

  const loadingButton = useRef<RefLoadingButton>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<TenantDto>({} as TenantDto);
  const [requested, setRequested] = useState(false);
  const [accepted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const currentEmail = useSelector((state: RootState) => {
    return state.account.user?.email ?? "";
  });

  const emailDisabled = () => {
    const { account } = store.getState();
    if (account.user?.email) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setEmail(currentEmail);

    if (!email) {
      setEmail(emailQueryParam ?? "");
    }

    if (params["tenant"]) {
      setLoading(true);
      services.tenantUserInvitations
        .getInviteURL(params["tenant"])
        .then((response: TenantDto) => {
          setTenant(response);
        })
        .catch((error) => {
          if (error.status === 404) {
            errorModal.current?.show(t("shared.invalidInvitation"));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function accept(e: FormEvent) {
    e.preventDefault();
    if (!emailDisabled() && password !== passwordConfirm) {
      errorModal.current?.show(t("account.login.errors.passwordMissmatch"));
      return;
    }
    loadingButton.current?.start();

    const user: UserVerifyRequest = {
      email,
      password,
      passwordConfirm,
    } as UserVerifyRequest;

    services.tenantUserInvitations
      .requestAccess(params["tenant"]?.toString() ?? "", user)
      .then(() => {
        setRequested(true);
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
  function signOut() {
    store.dispatch(logout);
    setEmail("");
  }
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("account.join.title")} | React SaasFrontend</title>
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
                      <img alt="Logo" src={tenant.logo} className="mx-auto h-12 w-auto" />
                    </Link>
                  </div>
                );
              } else {
                return <Logo className="mx-auto h-12 w-auto" />;
              }
            })()}
          </div>

          {(() => {
            if (requested) {
              return (
                <div>
                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
                      <h2 className="mt-6 text-center text-3xl leading-9 font-bold">{t("account.invitation.successTitle")}</h2>
                      <div className="my-4 leading-tight">
                        <p className="mt-2 text-center text-sm leading-5 max-w">{t("account.invitation.successText")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  {(() => {
                    if (loading) {
                      return <div>{/* { t("shared.loading") } */}</div>;
                    } else if (!tenant) {
                      return <div className="text-red-500 text-center">{t("shared.invalidInvitation")}</div>;
                    } else {
                      return <div></div>;
                    }
                  })()}

                  {tenant && tenant.name && (
                    <div>
                      {emailDisabled() && email && (
                        <div>
                          <p className="mt-2 text-center text-sm leading-5">
                            <button
                              onClick={signOut}
                              className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
                            >
                              {t("account.invitation.anotherEmail")}
                            </button>
                          </p>
                        </div>
                      )}
                      <div className="mt-6 text-center text-lg leading-9 font-bold">
                        {(() => {
                          if (accepted) {
                            return (
                              <div>
                                {t("account.invitation.acceptedUser", [tenant.name])}{" "}
                                <p className="font-normal text-base">{t("account.forgot.enterPassword")}</p>
                              </div>
                            );
                          } else {
                            return (
                              <div>
                                <h2 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">
                                  {t("account.invitation.requestAccess")} {tenant.name}
                                </h2>
                                <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                                  {t("account.register.alreadyRegistered")}{" "}
                                  <span className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                                    <Link to="/login">{t("account.register.clickHereToLogin")}</Link>
                                  </span>
                                </p>
                              </div>
                            );
                          }
                        })()}
                      </div>

                      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="py-8 px-4 sm:rounded-sm sm:px-10">
                          <form onSubmit={accept} className="sm:w-96">
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium leading-5">
                                {t("account.shared.email")}
                              </label>
                              <div className="mt-1 rounded-sm shadow-sm">
                                <input
                                  disabled={emailDisabled()}
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                  }}
                                  id="email"
                                  type="email"
                                  required
                                  className={classNames(
                                    "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                                    emailDisabled() && "cursor-not-allowed bg-gray-100"
                                  )}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="mt-6">
                                <label htmlFor="password" className="block text-sm font-medium leading-5">
                                  {t("account.shared.password")}
                                </label>
                                <div className="mt-1 rounded-sm shadow-sm">
                                  <input
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                    }}
                                    id="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                                  />
                                </div>
                              </div>
                              {!emailDisabled() && (
                                <div className="mt-6">
                                  <label htmlFor="confirmPassword" className="block text-sm font-medium leading-5">
                                    {t("account.register.confirmPassword")}
                                  </label>
                                  <div className="mt-1 rounded-sm shadow-sm">
                                    <input
                                      value={passwordConfirm}
                                      onChange={(e) => {
                                        setPasswordConfirm(e.target.value);
                                      }}
                                      id="confirmPassword"
                                      type="password"
                                      required
                                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <span className="block w-full rounded-sm shadow-sm">
                                <LoadingButton ref={loadingButton} className="w-full block" type="submit">
                                  {accepted ? <span>{t("shared.enter")}</span> : <span>{t("shared.request")}</span>}
                                </LoadingButton>
                              </span>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
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
