import { useTranslation } from "react-i18next";
import { Menu } from "@headlessui/react";
import i18n from "@/locale/i18n";
import classNames from "@/utils/shared/ClassesUtils";
import Dropdown from "../dropdowns/Dropdown";
import _supportedLocales from "@/locale/supportedLocales";

interface Props {
  className?: string;
  btnClassName?: string;
}

export default function LocaleSelector({ className, btnClassName }: Props) {
  const { t } = useTranslation();

  const supportedLocales = _supportedLocales;

  function select(value) {
    localStorage.setItem("locale", value);
    i18n.changeLanguage(value);
  }

  return (
    <Dropdown
      className={className}
      btnClassName={classNames(
        "cursor-pointer select-none leading-6 font-medium focus:outline-none transition ease-in-out duration-150 px-3 py-1 rounded-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:text-gray-900 dark:focus:text-white",
        btnClassName
      )}
      button={<span>{t("settings.preferences.language")}</span>}
      options={
        <div>
          {supportedLocales.map((language, index) => {
            return (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => select(language.lang)}
                    key={index}
                    className={classNames("w-full text-left", active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                    role="menuitem"
                  >
                    <div>{t("shared.locales." + language.lang)}</div>
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </div>
      }
    />
  );
}
