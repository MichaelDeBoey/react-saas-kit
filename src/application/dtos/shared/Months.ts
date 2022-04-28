import i18n from "@/locale/i18n";
import { Month } from "./Month";

const months: Month[] = [];
for (let month = 1; month <= 12; month++) {
  months.push({
    value: month,
    title: i18n.t("app.shared.months." + month).toString(),
    shortTitle: i18n
      .t("app.shared.months." + month)
      .toString()
      .substr(0, 3),
  });
}

export default months;
