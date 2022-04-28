import IconLight from "../../assets/img/icon-light.png";
import IconDark from "../../assets/img/icon-dark.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Theme } from "@/application/enums/shared/Theme";
import classNames from "@/utils/shared/ClassesUtils";

interface Props {
  className?: string;
  size?: string;
}

export default function Icon({ className = "", size = "h-9" }: Props) {
  const theme = useSelector<RootState>((state) => state.theme.value);
  return (
    <div className={className}>
      {(() => {
        if (theme === Theme.DARK) {
          return <img className={classNames(size, "w-auto mx-auto")} src={IconDark} alt="Logo" />;
        } else {
          return <img className={classNames(size, "w-auto mx-auto")} src={IconLight} alt="Logo" />;
        }
      })()}
    </div>
  );
}
