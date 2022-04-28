import { useTranslation } from "react-i18next";
import LoadingButton, { RefLoadingButton } from "@/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import PayCard from "@/components/front/PayCard";
import services from "@/services";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary";

interface Props {
  className?: string;
}

export default function MySubscriptionPaymentDetails({ className = "" }: Props) {
  const { t } = useTranslation();

  const successModal = useRef<RefSuccessModal>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const loadingButton = useRef<RefLoadingButton>(null);

  const [editing, setEditing] = useState(false);

  function updateCardToken(response) {
    services.subscriptionManager
      .updateCardToken(response.token.id)
      .then(() => {
        services.subscriptionManager.getCurrentSubscription();
        successModal.current?.show(t("shared.updated"), t("settings.tenant.payment.updated"));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), error);
      })
      .finally(() => {
        if (loadingButton.current) {
          loadingButton.current?.stop();
        }
        setEditing(false);
      });
  }
  const subscriptionCard = useSelector((state: RootState): SubscriptionCardDto | undefined => {
    const methods = state.tenant?.subscription?.paymentMethods;
    if (methods && methods?.length > 0) {
      return state.tenant?.subscription?.paymentMethods[0].card;
    }
    return undefined;
  });
  const subscriptionCardLast4 = () => {
    return subscriptionCard?.lastFourDigits;
  };
  const subscriptionCardExpDesc = () => {
    return ("0" + subscriptionCard?.expiryMonth).slice(-2) + " / " + subscriptionCard?.expiryYear;
  };

  return (
    <div className={className}>
      <div className="shadow overflow-hidden sm:rounded-sm">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-6 sm:col-span-6 w-full">
              <span id="listbox-label" className="flex justify-between leading-5 font-medium text-gray-900 mb-4">
                {t("settings.tenant.payment.title")}
              </span>
              {(() => {
                if (subscriptionCard && !editing) {
                  return (
                    <div className="text-gray-600 text-sm font-semibold">
                      <span className="uppercase">{subscriptionCard.brand}</span> {t("settings.tenant.payment.ending")} **** {subscriptionCardLast4()} -{" "}
                      {subscriptionCardExpDesc()}
                    </div>
                  );
                } else {
                  return (
                    <div>
                      {(() => {
                        if (editing) {
                          return (
                            <div id="card-element">
                              <PayCard
                                onPayed={updateCardToken}
                                onError={(error) => {
                                  errorModal.current?.show(t("shared.error"), t(error));
                                }}
                              >
                                <LoadingButton ref={loadingButton} className="w-full block" type="submit">
                                  {t("shared.confirm")}
                                </LoadingButton>
                              </PayCard>
                              {/* 

                      TODO
                      <card
                        ref="card"
                        className="stripe-card w-full"
                        :className="complete ? 'border-1 border-green-100' : ''"
                      :stripe="stripeKey"
                      :options="stripeOptions"
                      onChange={() => complete = $event.complete}
                  /> */}
                            </div>
                          );
                        } else {
                          return <div className="text-red-500 text-sm">{t("settings.tenant.payment.notSet")}</div>;
                        }
                      })()}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <ButtonSecondary onClick={() => setEditing(!editing)}>
            <span>{!editing ? t("shared.edit") : t("shared.cancel")}</span>
          </ButtonSecondary>

          {/* {editing && (
            <LoadingButton
              className="w-auto ml-3 py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-sm text-white bg-gray-800 shadow-sm hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
              clicked={updatePaymentDetails}
              ref={loadingButton}
            >
              {t("shared.save")}
            </LoadingButton>
          )} */}
        </div>
      </div>

      <SuccessModal ref={successModal} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
