import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import Loading from "@/components/ui/loaders/Loading";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import { RootState } from "@/store";
import { useEscapeKeypress } from "@/utils/shared/KeypressUtils";
import SelectUsers, { RefSelectUsers } from "../users/SelectUsers";
import { useSelector } from "react-redux";
import classNames from "@/utils/shared/ClassesUtils";

interface Props {
  maxSize?: string;
}

export default function EditWorkspace({ maxSize = "sm:max-w-lg" }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  const selectUsers = useRef<RefSelectUsers>(null);
  const confirmRemove = useRef<RefConfirmModal>(null);

  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [businessMainActivity, setBusinessMainActivity] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [item, setItem] = useState<WorkspaceDto | null>(null);
  const [type, setType] = useState<WorkspaceType>(WorkspaceType.PRIVATE);
  const [registrationDate, setRegistrationDate] = useState<string>("");
  const [users, setUsers] = useState<UserDto[]>([]);

  useEffect(() => {
    setShowing(true);
    setLoading(true);
    services.workspaces
      .get(id ?? "")
      .then((response) => {
        setItem(response);
        setName(response.name);
        setType(response.type);
        setBusinessMainActivity(response.businessMainActivity);
        setRegistrationNumber(response.registrationNumber);
        if (response.registrationDate) {
          setRegistrationDate(response.registrationDate.toString());
        }
        setUsers([]);
        response.users.forEach((element) => {
          if (element.user !== undefined) {
            setUsers([...users, element.user]);
          }
        });
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function close() {
    navigate("/app/settings/workspaces");
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (users.length === 0) {
      errorModal.current?.show(t("shared.error"), t("account.tenant.workspaces.errors.atLeastOneUser"));
      return;
    }
    setLoading(true);
    services.workspaces
      .update(id ?? "", {
        name,
        type,
        businessMainActivity,
        registrationNumber,
        registrationDate: new Date(registrationDate),
        users,
      })
      .then(() => {
        tinyEventBus().emitter.emit("workspace-saved");
        successModal.current?.show(t("shared.updated"));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function remove() {
    confirmRemove.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function yesRemove() {
    if (currentRole == TenantUserRole.MEMBER || currentRole == TenantUserRole.GUEST) {
      errorModal.current?.show(t("account.tenant.onlyAdmin"));
    } else {
      setLoading(true);
      services.workspaces
        .delete(id ?? "")
        .then(() => {
          tinyEventBus().emitter.emit("workspace-deleted", item);
          navigate("/app/settings/workspaces");
        })
        .catch((error) => {
          errorModal.current?.show(t("shared.error"), t(error));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  function selectWorkspaceUsers() {
    selectUsers.current?.show(users.map((f) => f.id));
  }
  function selectedUsers(items: UserDto[]) {
    setUsers(items);
  }
  function changedType(e) {
    const _type: WorkspaceType = Number(e.target.value);
    setType(_type);
  }
  const currentRole = useSelector((state: RootState): TenantUserRole => {
    return state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  });
  const currentUsersDescription = (users: UserDto[]) => {
    if (users.length === 0) {
      return t("app.users.seletAtLeastOne");
    }
    return users.map((f) => `${f.firstName} (${f.email})`).join(", ");
  };

  useEscapeKeypress(close);
  return (
    <div>
      <div>
        <div className="fixed inset-0 overflow-y-auto">
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
                className={classNames(
                  "inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6",
                  maxSize
                )}
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
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">{t("app.workspaces.actions.edit")}</h4>
                  </div>
                  {(() => {
                    if (loading) {
                      return <Loading />;
                    } else if (!item) {
                      return <div>{t("shared.notFound")}</div>;
                    } else if (item) {
                      return (
                        <form onSubmit={save} className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            {/*Workspace Name */}
                            <div className="col-span-2">
                              <label htmlFor="name" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.workspace.name")}
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  autoComplete="off"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  disabled={loading}
                                  className={classNames(
                                    "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                                    loading && "bg-gray-100 cursor-not-allowed"
                                  )}
                                />
                              </div>
                            </div>
                            {/*Workspace Name: End */}

                            {/*Workspace Business Main Activity */}
                            <div className="col-span-2">
                              <label htmlFor="business-main-activity" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.workspace.businessMainActivity")}
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  id="business-main-activity"
                                  name="business-main-activity"
                                  autoComplete="off"
                                  required
                                  value={businessMainActivity}
                                  onChange={(e) => setBusinessMainActivity(e.target.value)}
                                  className={classNames(
                                    "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                                    loading && "bg-gray-100 cursor-not-allowed"
                                  )}
                                />
                              </div>
                            </div>
                            {/*Workspace Business Main Activity: End */}

                            {/*Workspace Type */}
                            <div className="col-span-2">
                              <label htmlFor="type" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.workspace.type")}
                              </label>
                              <div className="mt-1 rounded-md shadow-sm w-full">
                                <fieldset name="type" id="type">
                                  <legend className="sr-only">{t("models.workspace.type")}</legend>
                                  <div className="bg-white rounded-md -space-y-px">
                                    <label
                                      className={classNames(
                                        "rounded-tl-md rounded-tr-md relative border py-2 px-4 flex cursor-pointer focus:outline-none",
                                        type === 0 && "bg-theme-50 border-theme-200 z-10",
                                        type !== 0 && "border-gray-200"
                                      )}
                                    >
                                      <input
                                        type="radio"
                                        value={0}
                                        checked={type === 0}
                                        onChange={changedType}
                                        className="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                        aria-labelledby="workspace-type-0-label"
                                        aria-describedby="workspace-type-0-description"
                                      />
                                      <div className="ml-3 flex flex-col">
                                        <span
                                          id="workspace-type-0-label"
                                          className={classNames("block text-sm font-medium", type === 0 && "text-theme-900", type !== 0 && "text-gray-900")}
                                        >
                                          {t("app.workspaces.types.PRIVATE")}
                                        </span>

                                        <span
                                          id="workspace-type-0-description"
                                          className={classNames("block text-sm", type === 0 && "text-theme-700", type !== 0 && "text-gray-500")}
                                        >
                                          {t("app.workspaces.typesDescription.PRIVATE")}
                                        </span>
                                      </div>
                                    </label>

                                    <label
                                      className={classNames(
                                        "relative border py-2 px-4 flex cursor-pointer focus:outline-none",
                                        type === 1 && "bg-theme-50 border-theme-200 z-10",
                                        type !== 1 && "border-gray-200"
                                      )}
                                    >
                                      <input
                                        type="radio"
                                        value={1}
                                        checked={type === 1}
                                        onChange={changedType}
                                        name="workspace-type"
                                        className="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                        aria-labelledby="workspace-type-1-label"
                                        aria-describedby="workspace-type-1-description"
                                      />
                                      <div className="ml-3 flex flex-col">
                                        <span
                                          id="workspace-type-1-label"
                                          className={classNames("block text-sm font-medium", type === 1 && "text-theme-900", type !== 1 && "text-gray-900")}
                                        >
                                          {t("app.workspaces.types.PUBLIC")}
                                        </span>
                                        <span
                                          id="workspace-type-1-description"
                                          className={classNames("block text-sm", type === 1 && "text-theme-700", type !== 1 && "text-gray-500")}
                                        >
                                          {t("app.workspaces.typesDescription.PUBLIC")}
                                        </span>
                                      </div>
                                    </label>
                                  </div>
                                </fieldset>
                              </div>
                            </div>
                            {/*Workspace Type: End */}

                            {/*Workspace Registration Number */}
                            {type === 1 && (
                              <div>
                                <label htmlFor="registration-number" className="block text-xs font-medium text-gray-700 truncate">
                                  {t("models.workspace.registrationNumber")}
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm w-full">
                                  <input
                                    type="text"
                                    id="registration-number"
                                    name="registration-number"
                                    autoComplete="off"
                                    required
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    className={classNames(
                                      "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                                      loading && "bg-gray-100 cursor-not-allowed"
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            {/*Workspace Registration Number: End */}

                            {/*Workspace Registration Date */}
                            {type === 1 && (
                              <div>
                                <label htmlFor="registration-date" className="block text-xs font-medium text-gray-700 truncate">
                                  {t("models.workspace.registrationDate")}
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm w-full">
                                  <input
                                    type="date"
                                    id="registration-date"
                                    name="registration-date"
                                    autoComplete="off"
                                    required
                                    value={registrationDate}
                                    onChange={(e) => setRegistrationDate(e.target.value)}
                                    className={classNames(
                                      "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                                      loading && "bg-gray-100 cursor-not-allowed"
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            {/*Workspace Registration Date: End */}

                            {/*Workspace Users */}
                            <div className="col-span-2">
                              <label htmlFor="users" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.user.plural")}
                              </label>
                              <div className="mt-2 rounded-md w-full space-y-2">
                                <input
                                  type="text"
                                  id="users"
                                  autoComplete="off"
                                  disabled
                                  value={currentUsersDescription(users)}
                                  className="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                />
                                <button type="button" onClick={selectWorkspaceUsers} className="flex items-center space-x-1 text-xs text-theme-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  <span className="uppercase font-medium">{t("app.workspaces.actions.selectWorkspaceUsers")}</span>
                                </button>
                              </div>
                            </div>
                            {/*Workspace Users: End */}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {(() => {
                              if (loading) {
                                return (
                                  <div className="text-theme-700 text-sm">
                                    <div>{t("shared.loading")}...</div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div>
                                    <button
                                      disabled={loading}
                                      className={classNames(
                                        "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                        loading && "bg-gray-100 cursor-not-allowed"
                                      )}
                                      type="button"
                                      onClick={remove}
                                    >
                                      <div>{t("shared.delete")}</div>
                                    </button>
                                  </div>
                                );
                              }
                            })()}

                            <div className="flex items-center space-x-2">
                              <button
                                disabled={loading}
                                className={classNames(
                                  "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                  loading && "bg-gray-100 cursor-not-allowed"
                                )}
                                type="button"
                                onClick={close}
                              >
                                <div>{t("shared.cancel")}</div>
                              </button>
                              <button
                                disabled={loading}
                                className={classNames(
                                  "inline-flex items-center px-3 py-2 border space-x-2 border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                  loading && "opacity-50 cursor-not-allowed"
                                )}
                                type="submit"
                              >
                                <div>{t("shared.save")}</div>
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    } else {
                      return <div></div>;
                    }
                  })()}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <ConfirmModal ref={confirmRemove} onYes={yesRemove} />
      <ErrorModal ref={errorModal} />
      <SuccessModal ref={successModal} onClosed={close} />
      <SelectUsers ref={selectUsers} onSelected={selectedUsers} />
    </div>
  );
}
