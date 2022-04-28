import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import { SubscriptionCouponDto } from "@/application/dtos/core/subscriptions/SubscriptionCouponDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import Logo from "@/components/front/Logo";
import PayCard from "@/components/front/PayCard";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import Modal, { RefModal } from "@/components/ui/modals/Modal";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons";
import services from "@/services";
import store, { RootState } from "@/store";
import { setSelected } from "@/store/modules/pricingReducer";
import classNames from "@/utils/shared/ClassesUtils";
import NumberUtils from "@/utils/shared/NumberUtils";
import UserUtils from "@/utils/store/UserUtils";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const search = useLocation().search;
  const emailQueryParam = new URLSearchParams(search).get("e") ?? "";
  const selectPlanQueryParam = new URLSearchParams(search).get("p") ?? "";
  const invitationQueryParam = new URLSearchParams(search).get("i") ?? "";
  const couponQueryParam = new URLSearchParams(search).get("coupon") ?? "";

  const inputFirstName = useRef<HTMLInputElement>(null);
  const buttonAcceptInvitation = useRef<HTMLButtonElement>(null);
  const loadingButton = useRef<RefLoadingButton>(null);
  const modalInvitation = useRef<RefModal>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const cardModal = useRef<RefModal>(null);
  const confirmModalRegister = useRef<RefConfirmModal>(null);

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  // const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  // const [couponDescription, setCouponDescription] = useState("");
  const [coupon, setCoupon] = useState<SubscriptionCouponDto | null>(null);
  const [linkInvitation, setLinkInvitation] = useState<LinkInvitationDto | null>(null);
  const [joinedByLinkInvitation, setJoinedByLinkInvitation] = useState("");

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [workspaceNameEnabled, setWorkspaceNameEnabled] = useState(true);

  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  if (emailQueryParam) {
    setEmail(emailQueryParam);
  }

  const selectedProduct = useSelector((state: RootState): SubscriptionProductDto | null => {
    return state.pricing.selectedProduct;
  });

  const selectedPrice = useSelector((state: RootState): SubscriptionPriceDto | undefined => {
    return (
      selectedProduct?.prices.find((f) => f.billingPeriod === state.pricing.billingPeriod && f.currency === state.pricing.currency) ??
      selectedProduct?.prices.filter((f) => f.currency === state.pricing.currency)[0]
    );
  });

  useEffect(() => {
    setLoading(true);
    services.subscriptionProducts
      .getProducts()
      .then(() => {
        if (selectPlanQueryParam) {
          const product = products.find((f) => f.tier === Number(selectPlanQueryParam));
          if (product) {
            store.dispatch(
              setSelected({
                product,
                billingPeriod: selectedPrice?.billingPeriod ?? SubscriptionBillingPeriod.MONTHLY,
              })
            );
          }
        }

        if (couponQueryParam) {
          // setHasCoupon(true);
          setCouponCode(couponQueryParam.toString());
          searchCoupon(false);
        }
        if (invitationQueryParam) {
          services.links.getInvitation(invitationQueryParam.toString()).then((response) => {
            setLinkInvitation(response);
            loadLinkInvitation(response);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
    if (invitationQueryParam) {
      if (inputFirstName.current) {
        inputFirstName.current.focus();
        inputFirstName.current.select();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const billingPeriod = useSelector((): string => {
    if (!selectedPrice) {
      return "";
    }
    if (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return t("pricing.once").toString();
    } else {
      return "/ " + t("pricing." + SubscriptionBillingPeriod[selectedPrice.billingPeriod] + "Short");
    }
  });

  function loadLinkInvitation(linkInvitation) {
    if (linkInvitation) {
      if (linkInvitation.status === LinkStatus.PENDING) {
        modalInvitation.current?.show();
        // nextTick(() => {
        buttonAcceptInvitation.current?.focus();
        // });
      }
    }
  }
  function rejectInvitation() {
    modalInvitation.current?.close();
    services.links.rejectInvitation(linkInvitation?.id);
    setLinkInvitation(null);
  }
  function acceptInvitation() {
    modalInvitation.current?.close();
    setJoinedByLinkInvitation(linkInvitation?.id);
    setEmailEnabled(false);
    setWorkspaceNameEnabled(false);
    setEmail(linkInvitation?.email ?? "");
    setWorkspaceName(linkInvitation?.workspaceName ?? "");
    // nextTick(() => {
    if (inputFirstName.current) {
      inputFirstName.current?.focus();
      inputFirstName.current?.select();
    }
    // });
  }
  function searchCoupon(showError) {
    if (!selectedPrice) {
      return "";
    }
    if (!couponCode) {
      return;
    }
    services.subscriptionManager
      .getCoupon(couponCode, selectedPrice.currency)
      .then((response: SubscriptionCouponDto) => {
        setCoupon(response);
        // if (coupon && coupon.name) {
        //   setCouponDescription(coupon.name.toString());
        // }
      })
      .catch((error) => {
        // setCouponDescription(t("account.register.invalidCoupon").toString());
        if (showError) {
          errorModal.current?.show(t("shared.error"), t(error));
        }
      });
  }
  function tryRegister(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      errorModal.current?.show(t("shared.error"), t("api.errors.passwordMismatch"));
      return;
    }
    if (!selectedPrice) {
      errorModal.current?.show(t("shared.error"), t("account.register.errors.priceNotSelected"));
      return;
    }
    if (!acceptTermsAndConditions) {
      errorModal.current?.show(t("shared.error"), t("account.register.errors.acceptTermsAndConditions"));
      return;
    }
    if (selectedPrice.trialDays === 0 && selectedPrice.price > 0) {
      cardModal.current?.show();
    } else {
      confirmModalRegister.current?.show(
        t("account.register.prompts.register.title"),
        t("shared.confirm"),
        t("shared.back"),
        t("account.register.prompts.register.description", [t(selectedProduct?.title ?? "")])
      );
    }
  }
  function confirmedRegister() {
    register();
  }
  function payError(error) {
    cardModal.current?.close();
    errorModal.current?.show(t("shared.error"), t(error));
  }
  function payed(data) {
    cardModal.current?.close();
    if (data.error) {
      errorModal.current?.show(t("shared.error"), data.error.message);
    } else {
      register(data.token.id);
    }
  }
  function register(cardToken = "") {
    if (!selectedPrice) {
      errorModal.current?.show(t("shared.error"), t("account.register.errors.priceNotSelected"));
      return;
    } else if (selectedPrice && !selectedPrice.id) {
      errorModal.current?.show(t("shared.error"), t("account.register.errors.priceNotInDatabase"));
      return;
    }
    const user: UserRegisterRequest = {
      email,
      selectedSubscription: {
        subscriptionPriceId: selectedPrice.id ?? "",
        subscriptionCardToken: cardToken,
        subscriptionCoupon: couponCode,
      },
      password,
      confirmPassword,
      firstName,
      lastName,
      loginType: UserLoginType.PASSWORD,
      workspaceName,
      joinedByLinkInvitation,
    } as UserRegisterRequest;
    user.selectedSubscription = {
      subscriptionPriceId: selectedPrice.id ?? "",
      subscriptionCardToken: cardToken,
      subscriptionCoupon: couponCode,
    };
    loadingButton.current?.start();
    services.authentication
      .register(user)
      .then((response: UserLoggedResponse) => {
        setRegistered(true);
        UserUtils.logged(response, navigate);
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), error);
      })
      .finally(() => {
        if (loadingButton.current) {
          loadingButton.current?.stop();
        }
      });
  }
  function toggleAcceptTerms() {
    setAcceptTermsAndConditions(!acceptTermsAndConditions);
  }
  function intFormat(value) {
    return NumberUtils.intFormat(value);
  }
  const products = useSelector((state: RootState): SubscriptionProductDto[] => {
    return state.pricing.products;
  });

  const discountedPrice = useSelector((): number => {
    if (!selectedPrice) {
      return 0;
    }
    let price = selectedPrice.price;
    if (coupon) {
      if (coupon.amountOff && selectedPrice.currency === coupon.currency) {
        price = price - coupon.amountOff / 100;
      } else if (coupon.percentOff) {
        price = Number((price * ((100 - coupon.percentOff) / 100)).toFixed(2));
      }
    }
    return price;
  });
  const priceDescription = useSelector((): string => {
    if (!selectedPrice) {
      return "";
    }
    return "$" + intFormat(discountedPrice) + " " + selectedPrice.currency + " " + billingPeriod;
  });
  const getButtonText = useSelector((): string => {
    if (!selectedPrice) {
      return "";
    }
    return (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? t("pricing.pay") : t("pricing.subscribe")) + " " + priceDescription;
  });

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("account.register.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div>
        <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
          <Logo className="mx-auto h-12 w-auto" />
          {(() => {
            if (!registered) {
              return (
                <div>
                  <h2 className="mt-6 text-center text-lg leading-9 font-bold text-gray-800 dark:text-slate-200">{t("account.register.title")}</h2>
                  <p className="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">
                    {t("account.register.alreadyRegistered")}{" "}
                    <span className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                      <Link to="/login">{t("account.register.clickHereToLogin")}</Link>
                    </span>
                  </p>

                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="py-0 px-0 sm:rounded-sm sm:px-10">
                      <form onSubmit={tryRegister} className="space-y-6">
                        {/* Workspace */}
                        <div>
                          <label className="block text-sm font-medium">{t("account.register.organization")}</label>

                          <div className="mt-1 rounded-md shadow-sm -space-y-px">
                            <div>
                              <label htmlFor="company" className="sr-only">
                                {t("models.workspace.object")}
                              </label>
                              <input
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                type="text"
                                name="company"
                                id="company"
                                placeholder={t("models.workspace.name")}
                                required
                                onInput={(e) => setWorkspaceName(e.currentTarget.value)}
                                disabled={!workspaceNameEnabled}
                                className={classNames(
                                  "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                                  !workspaceNameEnabled && "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Workspace: End  */}

                        {/* Personal Info */}
                        <div>
                          <legend className="block text-sm font-medium">{t("account.register.personalInfo")}</legend>
                          <div className="mt-1 rounded-sm shadow-sm -space-y-px">
                            <div className="flex">
                              <div className="w-1/2">
                                <label htmlFor="first-name" className="sr-only">
                                  {t("models.user.firstName")}
                                </label>
                                <input
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  ref={inputFirstName}
                                  type="text"
                                  name="first-name"
                                  id="first-name"
                                  required
                                  className="appearance-none rounded-none rounded-tl-md relative block w-full px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                                  placeholder={t("account.register.firstName")}
                                />
                              </div>
                              <div className="w-1/2">
                                <label htmlFor="last-name" className="sr-only">
                                  {t("models.user.lastName")}
                                </label>
                                <input
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  type="text"
                                  name="last-name"
                                  id="last-name"
                                  required
                                  className="appearance-none rounded-none rounded-tr-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                                  placeholder={t("account.register.lastName")}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="email" className="sr-only">
                                {t("models.user.email")}
                              </label>
                              <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                placeholder={t("account.shared.email")}
                                disabled={!emailEnabled}
                                className={classNames(
                                  "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                                  !emailEnabled && "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                                )}
                              />
                            </div>
                            <input
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              placeholder={t("account.register.password")}
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                            <input
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              id="confirmPassword"
                              type="password"
                              autoComplete="off"
                              required
                              placeholder={t("account.register.confirmPassword")}
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                          </div>
                        </div>
                        {/* Personal Info: End */}

                        <PlansRadioButtons />

                        <div className="mt-2 flex items-center space-x-3">
                          <button
                            aria-label="accept-terms-and-conditions"
                            type="button"
                            onClick={toggleAcceptTerms}
                            role="switch"
                            aria-checked="false"
                            className={classNames(
                              "relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500",
                              acceptTermsAndConditions && "bg-theme-600 dark:bg-theme-400",
                              !acceptTermsAndConditions && "bg-gray-200 dark:bg-gray-700"
                            )}
                          >
                            <span className="sr-only">{t("app.workspaces.types.PUBLIC")}</span>
                            <span
                              className={classNames(
                                "translate-x-0 pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200",
                                acceptTermsAndConditions && "translate-x-4",
                                !acceptTermsAndConditions && "translate-x-0"
                              )}
                            >
                              {/* Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" */}
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  "opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
                                  acceptTermsAndConditions && "hidden opacity-0 ease-out duration-100",
                                  !acceptTermsAndConditions && "opacity-100 ease-in duration-200"
                                )}
                              >
                                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                  <path
                                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              {/* Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" */}
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  "opacity-0 ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity",
                                  acceptTermsAndConditions && "opacity-100 ease-in duration-200",
                                  !acceptTermsAndConditions && "hidden opacity-0 ease-out duration-100"
                                )}
                              >
                                <svg className="h-3 w-3 text-theme-600 dark:text-theme-400" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </button>
                          <span className="flex-grow flex flex-col">
                            <span className="text-sm font-normal dark:bg-gray-900 text-gray-800 dark:text-slate-200" id="accept-terms-and-conditions">
                              {t("account.register.acceptTerms")}
                            </span>
                          </span>
                        </div>

                        {!loading && (
                          <div className="mt-3">
                            <span className="block w-full rounded-sm shadow-sm">
                              <LoadingButton ref={loadingButton} className="w-full block" type="submit">
                                {(() => {
                                  if (selectedPrice && selectedPrice.price === 0) {
                                    return <span>{t("pricing.signUpFree")}</span>;
                                  } else if (selectedPrice && selectedPrice.trialDays > 0) {
                                    return <span>{t("account.register.startTrial", [selectedPrice.trialDays])}</span>;
                                  } else if (!getButtonText) {
                                    return <span>{t("settings.subscription.plans.select")}</span>;
                                  } else {
                                    return <span>{getButtonText}</span>;
                                  }
                                })()}
                              </LoadingButton>
                            </span>
                          </div>
                        )}

                        <p className="mt-3 py-2 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700">
                          {t("account.register.bySigningUp")}{" "}
                          <a target="_blank" href="/terms-and-conditions" className="text-theme-500 underline">
                            {t("account.register.termsAndConditions")}
                          </a>{" "}
                          {t("account.register.andOur")}{" "}
                          <a target="_blank" href="/privacy-policy" className="text-theme-500 underline">
                            {t("account.register.privacyPolicy")}
                          </a>
                          .
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="bg-white dark:bg-slate-800 max-w-sm w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
                    <h2 className="mt-6 text-center text-3xl leading-9 font-bold text-gray-800 dark:text-slate-200">{t("account.register.successTitle")}</h2>
                    <div className="my-4 leading-tight">
                      <p className="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">{t("account.register.successText")}</p>
                    </div>
                  </div>
                </div>
              );
            }
          })()}
        </div>

        <Modal ref={modalInvitation}>
          {linkInvitation && linkInvitation.createdByUser && linkInvitation.createdByWorkspace && (
            <div className="space-y-6 text-gray-900">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-theme-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-theme-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium" id="modal-title">
                  {t("app.links.invitation.toBe")}{" "}
                  {(() => {
                    if (linkInvitation.inviteeIsProvider) {
                      return <span className="font-bold text-theme-600">{t("models.provider.object")}</span>;
                    } else {
                      return <span className="font-bold text-theme-600">{t("models.client.object")}</span>;
                    }
                  })()}
                </h3>
                <div className="mt-4 text-left">
                  <p className="font-normal text-base">
                    {linkInvitation.createdByUser.firstName} (<span className="italic text-gray-600">{linkInvitation.createdByUser.email})</span>{" "}
                    {t("app.links.invitation.hasInvitedYou")} <span className="font-bold">{linkInvitation.createdByWorkspace.name}</span>{" "}
                    {t("app.links.invitation.andYourCompany")} <span className="font-bold">{linkInvitation.workspaceName}</span>{" "}
                    {(() => {
                      if (linkInvitation.inviteeIsProvider) {
                        return <span>{t("app.links.invitation.reasonAsProvider")}.</span>;
                      } else {
                        return <span>{t("app.links.invitation.reasonAsClient")}.</span>;
                      }
                    })()}
                  </p>
                </div>
                {linkInvitation.message && (
                  <div className="mt-4 text-left bg-gray-50 border border-gray-300 py-2 px-2">
                    <p className="font-normal text-base text-gray-600">
                      <span className="font-medium">
                        {t("app.links.invitation.message")} {linkInvitation.createdByUser.firstName}
                      </span>
                      : {linkInvitation.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              ref={buttonAcceptInvitation}
              onClick={acceptInvitation}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-600 text-base font-medium text-white hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:col-start-2 sm:text-sm"
            >
              {t("shared.accept")}
            </button>
            <button
              onClick={rejectInvitation}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              {t("shared.reject")}
            </button>
          </div>
        </Modal>
        <Modal ref={cardModal}>
          <div>
            <PayCard onPayed={payed} onError={payError}>
              <LoadingButton className="w-full block" type="submit">
                {getButtonText}
              </LoadingButton>
            </PayCard>
          </div>
        </Modal>
        <ConfirmModal ref={confirmModalRegister} onYes={confirmedRegister} />
        <ErrorModal ref={errorModal} />
      </div>
    </div>
  );
}
