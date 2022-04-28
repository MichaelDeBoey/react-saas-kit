import { useTranslation } from "react-i18next";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import services from "@/services";
import { RootState } from "@/store";
import { useRef, useEffect } from "react";
import MySubscriptionPaymentDetails from "./MySubscriptionPaymentDetails";
import MySubscriptionPlan from "./MySubscriptionPlan";
import MySubscriptionProducts from "./MySubscriptionProducts";
import { useSelector } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function MySubscription() {
  const { t } = useTranslation();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  const confirmModal = useRef<RefConfirmModal>(null);

  useEffect(() => {
    services.subscriptionProducts.getProducts();
    services.tenants.getCurrentUsage(AppUsageType.ALL);
  }, []);

  function cancel() {
    confirmModal.current?.show(t("settings.subscription.confirmCancel"));
  }
  function confirmCancel() {
    return services.subscriptionManager
      .cancelSubscription()
      .then(() => {
        successModal.current?.show(t("shared.updated"), t("settings.subscription.canceled"));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      });
  }
  const products = useSelector((state: RootState): TenantProductDto[] | undefined => {
    return (state.tenant?.subscription?.myProducts as TenantProductDto[]) ?? [];
  });
  const subscription = (products: TenantProductDto[] | undefined): SubscriptionPriceDto | undefined => {
    const mySubscriptions = products?.filter((f) => f.subscriptionPrice.billingPeriod !== SubscriptionBillingPeriod.ONCE);
    if (mySubscriptions && mySubscriptions.length > 0) {
      return mySubscriptions[0].subscriptionPrice;
    } else {
      return undefined;
    }
  };

  return (
    <div className="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <HelmetProvider>
        <Helmet>
          <title>{t("app.navbar.subscription")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="md:grid lg:grid-cols-3 md:gap-2">
        <div className="md:col-span-1">
          <div className="sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{t("settings.subscription.title")}</h3>

            <div className="mt-1 text-xs leading-5 text-gray-600">
              {(() => {
                if (subscription(products)) {
                  return (
                    <span>
                      <p className="text-xs text-gray-900 font-bold"></p>
                      <p>
                        <button onClick={cancel} className="text-gray-500 font-medium hover:underline hover:text-gray-600">
                          {t("settings.subscription.clickCancel")}
                        </button>
                      </p>
                    </span>
                  );
                } else {
                  return <span>{t("settings.subscription.description")}</span>;
                }
              })()}
            </div>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {!subscription && (!products || products.length === 0) && false && (
            <div>
              <div className="rounded-sm bg-yellow-50 p-4 mb-4 border border-yellow-200 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm leading-5 font-medium text-yellow-800">{t("settings.subscription.notSubscribed")}</h3>
                    <div className="mt-2 text-sm leading-5 text-yellow-700">
                      <p>{t("settings.subscription.notSubscribedDescription")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <MySubscriptionProducts withCurrentPlan={true} className="mb-4 bg-white shadow px-4 py-5 sm:p-6 space-y-2 sm:rounded-sm" />
          <MySubscriptionPlan />
          <MySubscriptionPaymentDetails className="mt-3" />
        </div>
      </div>

      <ConfirmModal ref={confirmModal} onYes={confirmCancel} />
      <SuccessModal ref={successModal} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
