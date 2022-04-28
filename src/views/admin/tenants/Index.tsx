import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import services from "@/services";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import NumberUtils from "@/utils/shared/NumberUtils";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary";
import Loading from "@/components/ui/loaders/Loading";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function AdminTenants() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TenantDto[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const headers = [
    {
      title: t("models.tenant.object"),
    },
    {
      title: t("models.workspace.plural"),
    },
    {
      title: t("models.tenant.subscription"),
    },
  ];

  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    setLoading(true);
    setItems([]);
    services.tenants
      .adminGetAll()
      .then((response: TenantDto[]) => {
        setItems(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function getWorkspaces(item: TenantDto) {
    return item.workspaces?.map((f) => `${f.name}`).join(", ");
  }
  function getUsers(item: TenantDto) {
    return item.users?.map((f) => `${f.firstName} ${f.lastName} (${f.email})`).join(", ");
  }
  function getProducts(item: TenantDto) {
    return item.products
      ?.map(
        (f) =>
          `${f.subscriptionProduct.tier} - ${t(f.subscriptionProduct.title)} (${NumberUtils.decimalFormat(f.subscriptionPrice.price)} ${
            f.subscriptionPrice.currency
          }${priceBillingPeriod(f.subscriptionPrice)})`
      )
      .join(", ");
  }
  function priceBillingPeriod(price: SubscriptionPriceDto): string {
    if (price.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return t("pricing.once").toString();
    } else {
      return "/" + t("pricing." + SubscriptionBillingPeriod[price.billingPeriod] + "Short");
    }
  }
  const orderedItems = (): TenantDto[] => {
    if (!filteredItems()) {
      return [];
    }
    return filteredItems()
      .slice()
      .sort((x, y) => {
        if (x.createdAt && y.createdAt) {
          return (x.createdAt > y.createdAt ? -1 : 1) ?? -1;
        }
        return -1;
      });
  };
  const filteredItems = (): TenantDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.subdomain !== "admin" &&
        (f.id?.toUpperCase().includes(searchInput.toUpperCase()) || f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()))
    );
  };
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("admin.tenants.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">
            {t("models.tenant.plural")}
            {!loading && (
              <span className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800 border border-gray-300">
                {orderedItems().length}
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-2 h-9">
            <ButtonSecondary onClick={reload} type="button">
              {t("shared.reload")}
            </ButtonSecondary>
          </div>
        </div>
      </div>
      <div className="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl xl:max-w-7xl">
        {(() => {
          if (loading) {
            return <Loading />;
          } else {
            return (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center justify-start w-full">
                    <div className="relative flex items-center w-full">
                      <div className="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="buscador"
                        id="buscador"
                        className="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder={t("shared.searchDot")}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {(() => {
                  if (orderedItems().length === 0) {
                    return (
                      <div>
                        <EmptyState
                          className="bg-white"
                          captions={{
                            thereAreNo: t("app.tenants.empty"),
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <div>
                          <div className="flex flex-col">
                            <div className="overflow-x-auto">
                              <div className="py-2 align-middle inline-block min-w-full">
                                <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {headers.map((header, idx) => {
                                          return (
                                            <th
                                              key={idx}
                                              scope="col"
                                              className="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate"
                                            >
                                              <div className="flex items-center space-x-1 text-gray-500">
                                                <div>{header.title}</div>
                                              </div>
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {orderedItems().map((item, idx) => {
                                        return (
                                          <tr key={idx}>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                              <div className="flex flex-col max-w-sm truncate">
                                                <Link to={"/admin/tenant/" + item.id} className="text-sm font-medium text-gray-900 hover:underline">
                                                  {item.name}
                                                </Link>
                                                <div>{getUsers(item)}</div>
                                              </div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                              <div className="max-w-sm truncate">{getWorkspaces(item)}</div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                              <div>{getProducts(item)}</div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
