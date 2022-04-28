import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en-US.json";
import es from "./es-MX.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
});

const locale = localStorage.getItem("locale") ?? import.meta.env.VITE_REACT_APP_LANGUAGE?.toString();
i18n.changeLanguage(locale);

export default i18n;
