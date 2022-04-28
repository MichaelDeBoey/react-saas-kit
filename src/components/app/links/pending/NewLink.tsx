import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { FormEvent, forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import services from "@/services";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import tinyEventBus from "@/plugins/tinyEventBus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import classNames from "@/utils/shared/ClassesUtils";
import WarningBanner from "@/components/ui/banners/WarningBanner";
import Loading from "@/components/ui/loaders/Loading";

export interface RefNewLink {
  show: (_asProvider: boolean, _selectType: boolean) => void;
}

interface Props {
  asProvider: boolean;
  selectType: boolean;
  onCreated?: (link: LinkDto) => void;
}

const NewLink = (props: Props, ref: Ref<RefNewLink>) => {
  const { t } = useTranslation();

  const inputEmail = useRef<HTMLInputElement>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const confirmCreateLinkModal = useRef<RefConfirmModal>(null);
  const confirmInviteNewUserModal = useRef<RefConfirmModal>(null);
  const successModal = useRef<RefSuccessModal>(null);

  const [selectType, setSelectType] = useState(props.selectType);
  const [asProvider, setAsProvider] = useState(props.asProvider);
  const [imProvider, setImProvider] = useState(false);

  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSearching, setLoadingSearching] = useState(false);
  const [loadingLinking, setLoadingLinking] = useState(false);
  const [email, setEmail] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspace, setWorkspace] = useState<WorkspaceDto | null>(null);
  const [linkCreated, setLinkCreated] = useState<LinkDto | null>(null);

  useEffect(() => {
    setImProvider(asProvider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputEmail.current?.focus();
    inputEmail.current?.select();
  }, [showing]);

  useImperativeHandle(ref, () => ({ show }));
  function show(_asProvider: boolean, _selectType: boolean) {
    setAsProvider(_asProvider);
    setSelectType(_selectType);
    setWorkspace(null);
    setEmail("");
    setWorkspaceName("");

    setShowing(true);
    reload();
  }

  function reload() {
    setLoading(true);
    const promises: any[] = [];
    promises.push(services.tenants.getCurrentUsage(AppUsageType.ALL));
    promises.push(services.tenants.getFeatures());

    Promise.all(promises).finally(() => {
      setLoading(false);
      if (inputEmail.current) {
        inputEmail.current?.focus();
        inputEmail.current?.select();
      }
    });
  }

  function close() {
    setShowing(false);
  }
  function linkUserWorkspace(e: FormEvent) {
    e.preventDefault();
    if (!email || email.trim() === "" || !workspaceName || workspaceName.trim() === "") {
      errorModal.current?.show(t("shared.missingFields"));
      return;
    }
    setLoadingSearching(true);
    setWorkspace(null);
    services.links
      .searchUser(email)
      .then(() => {
        searchWorkspace();
      })
      .catch(() => {
        confirmInviteNewUserModal.current?.show(
          t("app.links.accountNotFound"),
          t("shared.invite"),
          t("shared.cancel"),
          t("app.links.invitation.userNotRegistered", [email])
        );
        setLoadingSearching(false);
      });
  }
  function searchWorkspace() {
    services.links
      .searchMember(email, workspaceName)
      .then(() => {
        createLink();
      })
      .catch(() => {
        errorModal.current?.show(t("shared.error"), t("app.links.invitation.notFound", [email, workspaceName]));
      })
      .finally(() => {
        setLoadingSearching(false);
      });
  }
  function createLink() {
    const confirmText = workspace?.id ? t("app.links.link") : t("shared.invite");
    const inviteText = workspace?.id ? "" : t("app.links.invitation.invite");
    if (imProvider) {
      confirmCreateLinkModal.current?.show(t("app.clients.new.add"), confirmText, t("shared.cancel"), inviteText);
    } else {
      confirmCreateLinkModal.current?.show(t("app.providers.new.add"), confirmText, t("shared.cancel"), inviteText);
    }
  }
  function confirmInviteNewUser() {
    setLoadingLinking(true);
    services.links
      .createInvitation({
        email,
        workspaceName,
        message: "",
        inviteeIsProvider: !imProvider,
      })
      .then(() => {
        successModal.current?.show(t("app.links.pending.invitationSent"), t("app.links.pending.invitationSentDescription", [email]));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoadingLinking(false);
      });
  }
  function confirmCreateLink() {
    setLoadingLinking(true);
    services.links
      .create({
        email,
        workspaceName,
        asProvider: !imProvider,
        // permissions: permissions.value
      })
      .then((response) => {
        setLinkCreated(response);
        successModal.current?.show(
          t("app.links.pending.invitationSent"),
          t("app.links.invited", [email, imProvider ? t("models.client.object") : t("models.provider.object"), currentWorkspace.name])
        );
        services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoadingLinking(false);
      });
  }
  function createdLink() {
    tinyEventBus().emitter.emit("reload-links");
    if (linkCreated && props.onCreated) {
      props.onCreated(linkCreated);
    }
    close();
  }

  const maxLinks = useSelector((state: RootState): number => {
    return state.app.features.maxLinks;
  });
  const maxLinksReached = useSelector((state: RootState) => {
    return maxLinks > 0 && state.app.usage.providers + state.app.usage.clients >= maxLinks;
  });
  const currentWorkspace = useSelector((state: RootState): WorkspaceDto => {
    return state.tenant.currentWorkspace ?? ({} as WorkspaceDto);
  });

  useEscapeKeypress(close);
  return (
    <div>
      <div>
        {showing && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition
                as={Fragment}
                show={showing}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
                </div>
              </Transition>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
              <Transition
                as={Fragment}
                show={showing}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div
                  className="max-w-lg inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="just absolute top-0 right-0 -mt-4 pr-4">
                    <button
                      onClick={close}
                      type="button"
                      className="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">{t("shared.close")}</span>
                      <svg
                        className="h-5 w-5 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 space-y-4">
                    <h3 className="font-bold text-lg pb-2 border-b border-gray-100">
                      {imProvider ? <span>{t("app.links.newClient")}</span> : <span>{t("app.links.newProvider")}</span>}
                    </h3>
                    <div>
                      <div className="mx-auto">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            {(() => {
                              if (loading) {
                                return <Loading v-if="loading" />;
                              } else if (maxLinksReached) {
                                return (
                                  <div>
                                    <WarningBanner
                                      redirect="/app/settings/subscription"
                                      title={t("app.subscription.errors.limitReached")}
                                      text={t("app.subscription.errors.limitReachedLinks", [maxLinks])}
                                    />
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="bg-white rounded space-y-3">
                                    <form onSubmit={linkUserWorkspace} className="space-y-4">
                                      {selectType && (
                                        <div className="col-span-2 relative flex items-start select-none cursor-pointer">
                                          <div className="flex items-center h-5 cursor-pointer">
                                            <input
                                              id="imProvider"
                                              checked={imProvider}
                                              onChange={(e) => {
                                                setImProvider(e.target.checked);
                                              }}
                                              aria-describedby="imProvider-description"
                                              name="imProvider"
                                              type="checkbox"
                                              className="cursor-pointer focus:ring-theme-500 h-4 w-4 text-theme-600 border-gray-300 rounded"
                                            />
                                          </div>
                                          <div className="ml-3 text-sm">
                                            <label htmlFor="imProvider" className="font-medium text-gray-700 cursor-pointer">
                                              {t("app.links.imTheProvider")}
                                            </label>
                                          </div>
                                        </div>
                                      )}
                                      <div className="sm:col-span-6 grid grid-cols-2 gap-2">
                                        <div>
                                          <label htmlFor="email" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("account.shared.email")}
                                          </label>
                                          <div className="mt-1 flex rounded-md shadow-sm w-full">
                                            <input
                                              type="email"
                                              name="email"
                                              ref={inputEmail}
                                              id="email"
                                              autoComplete="off"
                                              required
                                              value={email}
                                              onChange={(e) => {
                                                setEmail(e.target.value);
                                              }}
                                              className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label htmlFor="workspaceName" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("models.workspace.object")}
                                          </label>
                                          <div className="mt-1 flex rounded-md shadow-sm w-full">
                                            <input
                                              type="text"
                                              name="workspaceName"
                                              id="workspaceName"
                                              autoComplete="off"
                                              required
                                              value={workspaceName}
                                              onChange={(e) => {
                                                setWorkspaceName(e.target.value);
                                              }}
                                              className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between mt-4">
                                        <div className="text-theme-700 text-sm">
                                          {(() => {
                                            if (loadingSearching) {
                                              return <div>{t("shared.searching")}...</div>;
                                            } else if (loadingLinking) {
                                              return <div>{t("shared.creating")}...</div>;
                                            } else {
                                              return <div></div>;
                                            }
                                          })()}
                                        </div>

                                        <button
                                          disabled={loadingSearching || loadingLinking}
                                          className={classNames(
                                            "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                            loadingSearching || (loadingLinking && "bg-gray-100 cursor-not-allowed")
                                          )}
                                          type="submit"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                            />
                                          </svg>

                                          <div>{t("shared.search")}</div>
                                        </button>
                                      </div>
                                    </form>
                                    {workspace && (
                                      <div>
                                        <div className="py-5 px-4 bg-theme-100 w-full border border-theme-200 shadow-sm">
                                          <div className="flex items-center justify-between space-x-1">
                                            <div className="flex items-center space-x-2 text-theme-800 truncate">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                />
                                              </svg>
                                              <div className="truncate">
                                                <p className="text-base font-medium">{t("app.links.accountFound")}</p>
                                                <p className="text-xs truncate">{workspaceName}</p>
                                              </div>
                                            </div>
                                            <div>
                                              <button
                                                type="button"
                                                onClick={createLink}
                                                className="ml-1 h-8 inline-flex items-center px-4 py-5 text-base leading-5 font-medium rounded-sm text-white bg-theme-800 hover:bg-theme-700 focus:outline-shadow active:bg-theme-900 transition duration-150 ease-in-out"
                                              >
                                                {t("app.links.link", [email])}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal ref={confirmCreateLinkModal} onYes={confirmCreateLink} />
      <ConfirmModal ref={confirmInviteNewUserModal} onYes={confirmInviteNewUser} />
      <SuccessModal ref={successModal} onClosed={createdLink} className="z-50 relative" />
      <ErrorModal className="z-50 relative" ref={errorModal} />
    </div>
  );
};

export default forwardRef(NewLink);
