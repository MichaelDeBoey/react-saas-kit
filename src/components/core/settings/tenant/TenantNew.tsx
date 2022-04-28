import { useTranslation } from "react-i18next";
import Modal, { RefModal } from "@/components/ui/modals/Modal";
import PayCard from "@/components/front/PayCard";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import services from "@/services";
import { setSelected } from "@/store/modules/pricingReducer";
import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import CurrencyToggle from "@/components/ui/toggles/CurrencyToggle";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import { login } from "@/store/modules/authReducer";
import UserUtils from "@/utils/store/UserUtils";
import { useNavigate } from "react-router-dom";

interface Props {
  close: () => void;
}

export default function TenantNew({ close }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const errorModal = useRef<RefErrorModal>(null);
  const cardModal = useRef<RefModal>(null);
  const confirmModal = useRef<RefConfirmModal>(null);
  const loadingButton = useRef<RefLoadingButton>(null);

  const [name, setName] = useState("");
  // const stripeOptions = {} as any;
  // let stripeKey = "";

  // stripeKey = import.meta.env.VITE_REACT_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
  // stripeOptions.value = {
  //   showCardHolderName: true,
  //   hidePostalCode: false,
  //   iconStyle: "solid",
  //   elements: {
  //     locale: i18n.global.locale,
  //   },
  // };

  const selectedProduct = useSelector((state: RootState) => {
    return state.pricing.selectedProduct as SubscriptionProductDto;
  });

  useEffect(() => {
    services.subscriptionProducts.getProducts().then((response) => {
      if (!selectedProduct) {
        store.dispatch(
          setSelected({
            product: response[0],
            billingPeriod: SubscriptionBillingPeriod.MONTHLY,
          })
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPrice = useSelector((state: RootState): SubscriptionPriceDto | undefined => {
    if (selectedProduct) {
      return selectedProduct.prices.find((f) => f.billingPeriod === state.pricing.billingPeriod) ?? selectedProduct.prices[0];
    }
    return undefined;
  });
  function createTenant() {
    if (!selectedPrice || name === "") {
      errorModal.current?.show(t("shared.missingFields"));
    } else {
      confirmModal.current?.show(t("settings.tenant.createConfirm"));
    }
  }
  function tryRegister() {
    if (selectedPrice?.trialDays === 0 && selectedPrice?.price > 0) {
      cardModal.current?.show();
    } else {
      register();
    }
  }
  function payError(error) {
    loadingButton.current?.stop();
    errorModal.current?.show(t("shared.error"), t(error));
  }
  function payed(data) {
    loadingButton.current?.stop();
    if (data.error) {
      errorModal.current?.show("Error", data.error.message);
    } else {
      register(data.token.id);
    }
  }
  function register(stripeCardToken = "") {
    const tenantCreateRequest: TenantCreateRequest = {
      name,
      selectedSubscription: {
        subscriptionPriceId: selectedPrice?.id ?? "",
        subscriptionCardToken: stripeCardToken,
        subscriptionCoupon: "",
      },
    };
    services.tenants
      .create(tenantCreateRequest)
      .then((response) => {
        store.dispatch(login(response));
        UserUtils.logged(response, navigate);
        window.location.reload();
        close();
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      });
  }
  const billingPeriod = useSelector((): string => {
    if (selectedPrice) {
      if (selectedPrice?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
        return t("pricing.once").toString();
      } else {
        return "/ " + t("pricing." + SubscriptionBillingPeriod[selectedPrice.billingPeriod] + "Short");
      }
    }
    return "";
  });
  const priceDescription = useSelector(() => {
    return "$" + selectedPrice?.price + " " + billingPeriod;
  });
  const getButtonText = useSelector((): string => {
    if (selectedPrice) {
      return (selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? t("pricing.pay") : t("pricing.subscribe")) + " " + priceDescription;
    }
    return "";
  });

  return (
    <div>
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <section className="absolute inset-y-0 pl-16 max-w-full right-0 flex">
            <div className="w-screen max-w-md">
              <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
                <div className="flex-1 h-0 overflow-y-auto bg-white text-gray-600">
                  <header className="space-y-1 py-6 px-4 bg-gray-100 sm:px-6 shadow-inner border-b border-gray-200">
                    <div className="flex items-center justify-between space-x-3">
                      <h2 className="text-lg leading-7 font-medium text-gray-800">{t("settings.tenant.create")}</h2>
                      <div className="h-7 flex items-center">
                        <button onClick={close} aria-label="Close panel" className="text-gray-500 hover:text-gray-800 transition ease-in-out duration-150">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm leading-5 text-gray-500">{t("settings.tenant.createDescription")}</p>
                    </div>
                  </header>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="px-4 divide-y divide-gray-200 sm:px-6">
                      <div className="space-y-3 pt-6 pb-5">
                        <div>
                          <label className="block text-sm font-medium">{t("account.register.organization")}</label>

                          <div className="mt-1 rounded-md shadow-sm -space-y-px">
                            <div>
                              <label htmlFor="tax-id" className="sr-only">
                                {t("models.workspace.name")}
                              </label>
                              <input
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                                type="text"
                                name="name"
                                id="name"
                                placeholder={t("models.workspace.name")}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-t-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <CurrencyToggle className="w-full flex justify-center" />
                        </div>
                        <div className="space-y-1">
                          <PlansRadioButtons />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 pb-6 text-right text-gray-700">
                        <div className="text-sm leading-5 right-0">
                          <span className="inline-flex rounded-sm shadow-sm">
                            <ButtonSecondary onClick={close}>{t("shared.cancel")}</ButtonSecondary>
                          </span>
                          <span className="inline-flex rounded-sm shadow-sm ml-2">
                            <ButtonPrimary onClick={createTenant}>{t("shared.create")}</ButtonPrimary>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Modal ref={cardModal}>
        <div>
          <PayCard
            onSubmit={() => {
              loadingButton.current?.start();
            }}
            onPayed={payed}
            onError={payError}
          >
            <LoadingButton ref={loadingButton} className="w-full block" type="submit">
              {getButtonText}
            </LoadingButton>
          </PayCard>
        </div>
      </Modal>
      <ErrorModal ref={errorModal} />
      <ConfirmModal ref={confirmModal} onYes={tryRegister} />
    </div>
  );
}
