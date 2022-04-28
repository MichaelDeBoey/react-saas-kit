import ButtonPrimary from "./ButtonPrimary";
import { forwardRef, MouseEventHandler, ReactNode, Ref, useImperativeHandle, useState } from "react";
import classNames from "@/utils/shared/ClassesUtils";

export interface RefLoadingButton {
  start: () => void;
  stop: () => void;
}

interface Props {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const LoadingButton = ({ className, type = "button", children, disabled, onClick }: Props, ref: Ref<RefLoadingButton>) => {
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  function start() {
    setLoading(true);
  }
  function stop() {
    setLoading(false);
  }
  return (
    <ButtonPrimary
      disabled={disabled || loading}
      className={classNames(className, "relative justify-center", loading && "base-spinner cursor-not-allowed")}
      type={type}
      onClick={onClick}
    >
      {children}
    </ButtonPrimary>
  );
};

export default forwardRef(LoadingButton);
