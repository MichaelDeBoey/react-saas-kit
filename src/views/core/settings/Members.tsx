import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import { UserType } from "@/application/enums/core/users/UserType";
import MembersListAndTable from "@/components/core/settings/members/MembersListAndTable";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import Loading from "@/components/ui/loaders/Loading";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import { RootState } from "@/store";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WarningBanner from "@/components/ui/banners/WarningBanner";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Members() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useLocation().search;
  const acceptedUserQueryParam = new URLSearchParams(search).get("au") ?? "";

  const errorModal = useRef<RefErrorModal>(null);
  const confirmAcceptUser = useRef<RefConfirmModal>(null);
  const confirmUpgrade = useRef<RefConfirmModal>(null);

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [items, setItems] = useState<TenantUserDto[]>([]);
  // const [tenantJoinSettings, setTenantJoinSettings] = useState({} as any);
  // const [enableLink, setEnableLink] = useState(false);
  // const [enablePublicUrl, setEnablePublicUrl] = useState(false);
  // const [requireAcceptance, setRequireAcceptance] = useState(false);
  const [acceptedUser, setAcceptedUser] = useState<TenantUserDto | null>(null);
  const [acceptUserEmail] = useState(acceptedUserQueryParam);

  useEffect(() => {
    tinyEventBus().emitter.on("user-added", () => reload());
    tinyEventBus().emitter.on("user-saved", () => reload());
    tinyEventBus().emitter.on("user-deleted", () => reload());

    reload();

    return () => {
      tinyEventBus().emitter.off("user-deleted");
      tinyEventBus().emitter.off("user-added");
      tinyEventBus().emitter.off("user-saved");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reload() {
    setLoading(true);
    const promises: any[] = [];
    promises.push(services.tenants.getFeatures());
    // promises.push(
    //   services.tenantUserInvitations.getInvitationSettings().then((response: TenantJoinSettingsDto) => {
    //     setTenantJoinSettings(response);
    //     setEnableLink(tenantJoinSettings.linkActive);
    //     setEnablePublicUrl(tenantJoinSettings.publicUrl);
    //     setRequireAcceptance(tenantJoinSettings.requireAcceptance);
    //   })
    // );
    promises.push(
      services.tenantUsers
        .getAll()
        .then((response: TenantUserDto[]) => {
          setItems(response);

          if (acceptUserEmail) {
            const user = items.find((f) => f.email === acceptUserEmail);
            if (user && user.status === TenantUserStatus.PENDING_ACCEPTANCE) {
              acceptUser(user, true);
            }
          }
        })
        .catch((error) => {
          errorModal.current?.show(t("shared.error"), t(error));
        })
    );

    Promise.all(promises).finally(() => {
      setLoading(false);
    });
  }
  // function saved(data) {
  //   const idx = items.findIndex((f) => f.id === data.id);
  //   items[idx] = data;
  // }
  // function deleted(data) {
  //   items(items.filter((f) => f.id !== data.id));
  // }
  function yesUpdateSubscription() {
    navigate("/app/settings/subscription");
  }
  function yesAcceptUser() {
    if (isOwnerOrAdmin() && acceptedUser) {
      services.tenantUserInvitations
        .acceptUser(acceptedUser)
        .then(() => {
          reload();
        })
        .catch((error) => {
          errorModal.current?.show(t("shared.error"), t(error));
        });
    }
  }
  function acceptUser(item: TenantUserDto, accept: boolean) {
    item.accepted = accept;
    setAcceptedUser(item);
    confirmAcceptUser.current?.show(t("shared.accept?", [item.email]).toString(), t("shared.accept").toString(), t("shared.cancel").toString());
  }
  const isOwnerOrAdmin = (): boolean => {
    return currentRole == TenantUserRole.OWNER || currentRole == TenantUserRole.ADMIN;
  };
  const currentRole = useSelector((state: RootState): TenantUserRole => {
    return state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  });
  const maxUsers = useSelector((state: RootState): number => {
    if (state.account.user?.type === UserType.Admin) {
      return 0;
    }
    return state.app.features.maxUsers;
  });
  const maxUsersReached = useSelector((state: RootState) => {
    return maxUsers > 0 && state.tenant.members.length >= maxUsers;
  });
  const filteredItems = (items: TenantUserDto[]): TenantUserDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.email?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.phone?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };
  const sortedItems = () => {
    if (!items) {
      return [];
    }
    const filtered = filteredItems(items)
      .slice()
      .sort((x, y) => {
        return x.role > y.role ? -1 : 1;
      });
    return filtered.sort((x, y) => {
      return x.role > y.role ? 1 : -1;
    });
  };

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("settings.members.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
        {(() => {
          if (loading) {
            return <Loading />;
          } else {
            return (
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center justify-between w-full space-x-2">
                      <div className="relative flex items-center w-full flex-grow">
                        <div className="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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
                      <Link
                        to="/app/settings/members/new"
                        className="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>

                        <div>{t("shared.new")}</div>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <MembersListAndTable items={sortedItems()} />

                    {!loading && maxUsersReached && (
                      <div>
                        <WarningBanner title={t("app.subscription.errors.limitReached")} text={t("app.subscription.errors.limitReachedUsers", [maxUsers])} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
      <ErrorModal ref={errorModal} />
      <ConfirmModal ref={confirmAcceptUser} onYes={yesAcceptUser} />
      <ConfirmModal ref={confirmUpgrade} onYes={yesUpdateSubscription} />
      <Outlet />
    </div>
  );
}
