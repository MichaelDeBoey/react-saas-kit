import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "@/utils/shared/ClassesUtils";

interface Props {
  className?: string;
  withCurrentPlan: boolean;
  cols?: string;
}

export default function MySubscriptionProducts({ className = "", withCurrentPlan = false, cols = "grid-cols-2 sm:grid-cols-2 xl:grid-cols-4" }: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionGetCurrentResponse | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceDto[]>([]);
  const [users, setUsers] = useState<TenantUserDto[]>([]);

  useEffect(() => {
    tinyEventBus().emitter.on("updated-plan", () => {
      reload();
    });
    reload();

    return () => {
      tinyEventBus().emitter.off("updated-plan");
    };
  }, []);

  function reload() {
    setLoading(true);

    const promises: any[] = [];

    const loadDashboard = services.subscriptionManager.getCurrentSubscription().then((response) => {
      setSubscription(response);
    });
    const loadWorkspaces = services.workspaces.getAllWorkspaces(false).then((response) => {
      setWorkspaces(response);
    });
    const loadUsers = services.tenantUsers.getAll().then((response) => {
      setUsers(response);
    });
    promises.push(loadDashboard);
    promises.push(loadWorkspaces);
    // promises.push(loadFeatures);
    promises.push(loadUsers);

    setLoading(true);
    Promise.all(promises).finally(() => {
      setLoading(false);
    });
  }
  function billableStatus(max: number): number {
    if (loading) {
      return 2;
    }
    if (!currentProduct) {
      return 0;
    }
    if (max === 0) {
      return 1;
    }
    if (max > 0) {
      return 2;
    }
    return 0;
  }
  const links = useSelector((state: RootState): number => {
    return state.app.usage.providers + state.app.usage.clients;
  });
  const currentProduct = useSelector((): TenantProductDto | undefined => {
    if (subscription?.myProducts && subscription?.myProducts.length > 0) {
      return subscription?.myProducts[0];
    }
    return undefined;
  });
  const usage = useSelector((state: RootState): AppUsageSummaryDto => {
    return state.app.usage;
  });
  const maxLinksRemaining = useSelector(() => {
    if (!currentProduct || !usage) {
      return 1;
    }
    const links = usage.providers + usage.clients;
    const remaining = currentProduct.maxLinks - links;
    return remaining;
  });
  const maxDocumentsRemaining = useSelector(() => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.monthlyContracts - usage.contracts;
  });
  const maxWorkspacesRemaining = useSelector(() => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.maxWorkspaces - workspaces.length;
  });
  const maxUsersRemaining = useSelector(() => {
    if (!currentProduct || !usage) {
      return 1;
    }
    return currentProduct.maxUsers - users.length;
  });

  return (
    <div className={className}>
      <div>
        {withCurrentPlan && (
          <div className="space-y-2 sm:space-y-0 sm:flex items-center sm:space-x-2 justify-between">
            <h3 className="leading-5 text-gray-900 truncate">
              {(() => {
                if (loading) {
                  return <span className="leading-5">{t("shared.loading")}...</span>;
                } else if (currentProduct) {
                  return (
                    <span>
                      {t("settings.subscription.current")}{" "}
                      <Link to="/app/settings/subscription" className="leading-5 font-bold hover:underline hover:text-theme-600">
                        {t(currentProduct.subscriptionProduct.title)}
                      </Link>
                    </span>
                  );
                } else if (!loading) {
                  return <span className="ml-1 text-sm leading-5 font-bold text-gray-500">({t("settings.subscription.noActivePlan")})</span>;
                } else {
                  return <div></div>;
                }
              })()}
            </h3>
          </div>
        )}
        <dl className={classNames("grid gap-5", cols, withCurrentPlan && "mt-2 ")}>
          <div
            className={classNames(
              "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6",
              billableStatus(maxLinksRemaining) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
              billableStatus(maxLinksRemaining) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
              billableStatus(maxLinksRemaining) === 2 && "bg-white",
              billableStatus(maxLinksRemaining) === 3 && "bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer"
            )}
          >
            <dt className="text-sm font-medium text-gray-500 truncate">{t("models.link.plural")}</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {(() => {
                if (loading) {
                  return <span>...</span>;
                } else {
                  return (
                    <span>
                      {links ? <span>{links}</span> : <span>0</span>} /{" "}
                      {currentProduct ? <span>{currentProduct.maxLinks}</span> : <span className="text-gray-500">0</span>}
                    </span>
                  );
                }
              })()}
            </dd>
          </div>

          <Link
            to="/app/contracts/pending"
            className={classNames(
              "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
              billableStatus(maxDocumentsRemaining) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
              billableStatus(maxDocumentsRemaining) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
              billableStatus(maxDocumentsRemaining) === 2 && "bg-white",
              billableStatus(maxDocumentsRemaining) === 3 && "bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer"
            )}
          >
            <dt className="text-sm font-medium text-gray-500 truncate">{t("models.contract.plural")}</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {(() => {
                if (loading) {
                  return <span>...</span>;
                } else {
                  return (
                    <span>
                      {usage && usage.contracts ? <span>{usage.contracts}</span> : <span>0</span>} /{" "}
                      {currentProduct ? <span>{currentProduct.monthlyContracts}</span> : <span className="text-gray-500">0</span>}
                    </span>
                  );
                }
              })()}
            </dd>
          </Link>

          <Link
            to="/app/settings/workspaces"
            className={classNames(
              "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
              billableStatus(maxWorkspacesRemaining) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
              billableStatus(maxWorkspacesRemaining) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
              billableStatus(maxWorkspacesRemaining) === 2 && "bg-white",
              billableStatus(maxWorkspacesRemaining) === 3 && "bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer"
            )}
          >
            <dt className="text-sm font-medium text-gray-500 truncate">{t("models.workspace.plural")}</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {(() => {
                if (loading) {
                  return <span>...</span>;
                } else {
                  return (
                    <span>
                      {usage ? <span>{workspaces.length}</span> : <span>0</span>} /{" "}
                      {currentProduct ? <span>{currentProduct.maxWorkspaces}</span> : <span className="text-gray-500">0</span>}
                    </span>
                  );
                }
              })()}
            </dd>
          </Link>
          <Link
            to="/app/settings/members"
            className={classNames(
              "bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50",
              billableStatus(maxUsersRemaining) === 0 && "bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer",
              billableStatus(maxUsersRemaining) === 1 && "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer",
              billableStatus(maxUsersRemaining) === 2 && "bg-white",
              billableStatus(maxUsersRemaining) === 3 && "bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer"
            )}
          >
            <dt className="text-sm font-medium text-gray-500 truncate">{t("models.user.plural")}</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {(() => {
                if (loading) {
                  return <span>...</span>;
                } else {
                  return (
                    <span>
                      {usage ? <span>{users.length}</span> : <span>0</span>} /{" "}
                      {currentProduct ? <span>{currentProduct.maxUsers}</span> : <span className="text-gray-500">0</span>}
                    </span>
                  );
                }
              })()}
            </dd>
          </Link>
        </dl>
      </div>
    </div>
  );
}
