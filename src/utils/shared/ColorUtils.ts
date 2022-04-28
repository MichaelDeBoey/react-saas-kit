import { Colors } from "@/application/enums/shared/Colors";
import i18n from "@/locale/i18n";

export function getTailwindColor(itemColor: Colors, textWeight = 50, backgroundWeight = 300, borderWeight = 500): string {
  let color = "gray";
  switch (itemColor) {
    case 0:
      color = "gray";
      break;
    case 1:
      color = "slate";
      break;
    case 2:
      color = "gray";
      break;
    case 3:
      color = "gray";
      break;
    case 4:
      color = "neutral";
      break;
    case 5:
      color = "stone";
      break;
    case 6:
      color = "red";
      break;
    case 7:
      color = "orange";
      break;
    case 8:
      color = "amber";
      break;
    case 9:
      color = "yellow";
      break;
    case 10:
      color = "lime";
      break;
    case 11:
      color = "green";
      break;
    case 12:
      color = "emerald";
      break;
    case 13:
      color = "teal";
      break;
    case 14:
      color = "cyan";
      break;
    case 15:
      color = "sky";
      break;
    case 16:
      color = "blue";
      break;
    case 17:
      color = "indigo";
      break;
    case 18:
      color = "violet";
      break;
    case 19:
      color = "purple";
      break;
    case 20:
      color = "pink";
      break;
    case 21:
      color = "rose";
      break;
  }
  const textColor = textWeight === 0 ? "text-white" : `text-${color}-${textWeight}`;
  return `${textColor} bg-${color}-${backgroundWeight} border border-${color}-${borderWeight}`;
}

export const colors = [
  // {
  //   name: "Indefinido",
  //   id: 0,
  // },
  {
    name: i18n.t("app.shared.colors.GRAY"),
    id: 3,
  },
  {
    name: i18n.t("app.shared.colors.BLUE_GRAY"),
    id: 1,
  },
  {
    name: i18n.t("app.shared.colors.RED"),
    id: 6,
  },
  {
    name: i18n.t("app.shared.colors.ORANGE"),
    id: 7,
  },
  {
    name: i18n.t("app.shared.colors.AMBER"),
    id: 8,
  },
  {
    name: i18n.t("app.shared.colors.YELLOW"),
    id: 9,
  },
  {
    name: i18n.t("app.shared.colors.LIME"),
    id: 10,
  },
  {
    name: i18n.t("app.shared.colors.GREEN"),
    id: 11,
  },
  {
    name: i18n.t("app.shared.colors.EMERALD"),
    id: 12,
  },
  {
    name: i18n.t("app.shared.colors.TEAL"),
    id: 13,
  },
  {
    name: i18n.t("app.shared.colors.CYAN"),
    id: 14,
  },
  {
    name: i18n.t("app.shared.colors.LIGHT_BLUE"),
    id: 15,
  },
  {
    name: i18n.t("app.shared.colors.BLUE"),
    id: 16,
  },
  {
    name: i18n.t("app.shared.colors.INDIGO"),
    id: 17,
  },
  {
    name: i18n.t("app.shared.colors.VIOLET"),
    id: 18,
  },
  {
    name: i18n.t("app.shared.colors.PURPLE"),
    id: 19,
  },
  {
    name: i18n.t("app.shared.colors.PINK"),
    id: 20,
  },
  {
    name: i18n.t("app.shared.colors.ROSE"),
    id: 21,
  },
];
