import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode, useRef } from "react";
import { RefLoadingButton } from "../ui/buttons/LoadingButton";
const stripePromise = loadStripe("pk_test_51K2UCeAziNLas9VZXT0XGVSKodrRZEtLoQk4soIrN1fL4HfcVmUCc4BIeYZ6QWD00HtbSb0MUNSuPD7mkq4cycUD00KABpDy0j");

interface Props {
  children: ReactNode;
  onPayed: (token) => void;
  onError: (error) => void;
  onSubmit?: () => void;
}

const Pay = ({ children, onPayed, onError, onSubmit }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const loadingButton = useRef<RefLoadingButton>(null);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
    if (elements && stripe) {
      const cardElement = elements.getElement("card");
      if (cardElement) {
        loadingButton.current?.start();
        stripe
          .createToken(cardElement)
          .then((payload) => {
            onPayed(payload);
          })
          .catch((ex) => {
            onError(ex);
          })
          .finally(() => {
            loadingButton.current?.stop();
          });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <CardElement id="card" className="mb-5" />
      {children}
    </form>
  );
};

export default function PayCard(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <Pay {...props} />
    </Elements>
  );
}
