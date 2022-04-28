import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import IconContract from "@/assets/icons/IconContract";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import Loading from "@/components/ui/loaders/Loading";
import UploadDocument from "@/components/ui/uploaders/UploadDocument";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import store from "@/store";
import { useRef, useState, useEffect } from "react";
import ContractMembers from "./ContractMembers";
import classNames from "@/utils/shared/ClassesUtils";
import { Menu } from "@headlessui/react";
import PdfViewer from "@/components/ui/pdf/PdfViewer";
import DropdownWithClick from "@/components/ui/dropdowns/DropdownWithClick";
import ContractEmployees from "./ContractEmployees";
import ContractActivity from "./ContractActivity";
import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";

interface Props {
  id: string;
}

export default function ContractDetails({ id = "" }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const inputName = useRef<HTMLInputElement>(null);
  const confirmSendContract = useRef<RefConfirmModal>(null);
  const confirmDelete = useRef<RefConfirmModal>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);

  const [name, setName] = useState("");
  const [status, setStatus] = useState(ContractStatus.PENDING);
  const [description, setDescription] = useState("");
  const [contractPdf, setContractPdf] = useState("");

  const [editing, setEditing] = useState(false);

  const [item, setItem] = useState<ContractDto | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    tinyEventBus().emitter.on("contract-reload", () => {
      reload();
    });
    reload();

    return () => {
      tinyEventBus().emitter.off("contract-reload");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reload() {
    setLoading(true);
    setItem(undefined);
    services.contracts
      .getContract(id)
      .then((response) => {
        setItem(response);
        setName(response.name);
        setStatus(response.status);
        setDescription(response.description);
        loadPdf();
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function removeFile() {
    if (item) {
      setContractPdf("");
    }
  }
  function loadPdf() {
    downloadFile(false);
  }
  function downloadFile(open: boolean) {
    setLoadingPdf(true);
    services.contracts
      .downloadFile(id)
      .then((response) => {
        if (open) {
          const downloadLink = document.createElement("a");
          const fileName = item?.name + ".pdf";
          downloadLink.href = response;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          setContractPdf(response);
        }
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  }
  function downloadPdf() {
    if (item) {
      const downloadLink = document.createElement("a");
      const fileName = item?.name + ".pdf";
      downloadLink.href = contractPdf;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
  function toggleEdit() {
    setEditing(!editing);
    if (editing) {
      inputName.current?.focus();
      inputName.current?.select();
      if (item) {
        setName(item.name);
        setStatus(item.status);
        setDescription(item.description);
        loadPdf();
      }
    }
  }
  function deleteContract() {
    confirmDelete.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function yesDelete() {
    setLoading(true);
    services.contracts
      .delete(item?.id)
      .then(() => {
        navigate("/app/contracts/all");
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
        setLoading(false);
      });
  }
  function droppedContractFile(files: FileBase64[]) {
    if (item) {
      if (files.length > 0) {
        setContractPdf(files[0].base64);
      }
    }
  }
  function send() {
    confirmSendContract.current?.show(
      t("shared.send"),
      t("shared.send"),
      t("shared.cancel"),
      t("shared.sendTo", [item?.members.map((f) => (f.user.firstName + " " + f.user.lastName).trim() + " (" + f.user.email + ")").join(", ")])
    );
  }
  function yesSendContract() {
    if (!item) {
      return;
    }
    services.contracts
      .send(item.id, {
        emails: [],
      })
      .then(() => {
        successModal.current?.show(t("shared.sent"));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      });
  }
  function save() {
    if (!name) {
      errorModal.current?.show(t("shared.error"), t("app.contracts.errors.nameRequired"));
    } else if (!description) {
      errorModal.current?.show(t("shared.error"), t("app.contracts.errors.descriptionRequired"));
    } else if (!contractPdf) {
      errorModal.current?.show(t("shared.error"), t("app.contracts.errors.fileRequired"));
    } else {
      setLoading(true);
      services.contracts
        .update(id, {
          name,
          description,
          file: contractPdf,
          status,
        })
        .then(() => {
          setEditing(false);
          successModal.current?.show(t("shared.updated"), t("shared.saved"));
        })
        .catch((error) => {
          errorModal.current?.show(t("shared.error"), t(error));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  const clientFullName = () => {
    if (item && item.link?.clientWorkspace) {
      return `${item.link.clientWorkspace.name}`;
    }
    return "";
  };
  const providerFullName = () => {
    if (item && item.link?.providerWorkspace) {
      return `${item.link.providerWorkspace.name}`;
    }
    return "";
  };
  const canBeEdited = () => {
    return item?.members.filter((f) => f.role === 0 && f.signDate).length === 0;
  };
  const isOwnerOrAdmin = (): boolean => {
    return currentRole() === TenantUserRole.OWNER || currentRole() === TenantUserRole.ADMIN;
  };
  const currentRole = (): TenantUserRole => {
    const { tenant } = store.getState();
    return tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  };
  const canEdit = () => {
    if (isOwnerOrAdmin()) {
      return true;
    }
    const { account } = store.getState();
    return item?.createdByUserId === account.user?.id || true;
  };

  return (
    <div className="max-w-5xl xl:max-w-7xl mx-auto pb-6">
      {(() => {
        if (loading) {
          return <Loading />;
        } else if (!item || !item.id) {
          return <div className="mx-auto p-5 items-center justify-between flex text-red-700">{error}</div>;
        } else if (item) {
          return (
            <div key={id}>
              <div className="md:flex space-y-2 md:space-y-0 items-center justify-between py-3 border-b border-gray-200 mb-2 md:space-x-3">
                <div className="font-bold text-xl uppercase truncate">
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex justify-end items-end space-x-2">
                  {editing && isOwnerOrAdmin && (
                    <button
                      onClick={deleteContract}
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {t("shared.delete")}
                    </button>
                  )}
                  {editing && (
                    <button
                      onClick={toggleEdit}
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                    >
                      {t("shared.cancel")}
                    </button>
                  )}
                  {editing && (
                    <button
                      onClick={save}
                      type="submit"
                      className="inline-flex truncate justify-center px-4 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                    >
                      {t("shared.saveChanges")}
                    </button>
                  )}
                  {!editing && (
                    <div className="flex items-end space-x-2 space-y-0">
                      <DropdownWithClick
                        onClick={downloadPdf}
                        button={
                          <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            {t("shared.download")}
                          </div>
                        }
                        options={
                          <div>
                            {canEdit() && (
                              <Menu.Item>
                                <button
                                  type="button"
                                  onClick={toggleEdit}
                                  disabled={!canBeEdited()}
                                  className={classNames(
                                    "w-full text-left text-gray-700 block px-4 py-2 text-sm focus:outline-none",
                                    !canBeEdited() && " bg-gray-100 cursor-not-allowed",
                                    canBeEdited() && " hover:bg-gray-50"
                                  )}
                                  role="menuitem"
                                  tabIndex={-1}
                                  id="option-menu-item-1"
                                >
                                  <div>{t("shared.edit")}</div>
                                </button>
                              </Menu.Item>
                            )}
                            <Menu.Item>
                              <button
                                type="button"
                                onClick={reload}
                                className="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                                role="menuitem"
                                tabIndex={-1}
                                id="option-menu-item-6"
                              >
                                {t("shared.reload")}
                              </button>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                type="button"
                                onClick={send}
                                className="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                                role="menuitem"
                                tabIndex={-1}
                                id="option-menu-item-6"
                              >
                                {t("shared.send")}
                              </button>
                            </Menu.Item>
                          </div>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 min-h-screen">
                <div className="py-2">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="mb-2 text-gray-400 font-medium text-sm">{t("app.contracts.details.general")}</h3>
                        <div className="bg-white p-3 rounded border border-gray-100 shadow-md space-y-3">
                          <div className="grid sm:grid-cols-3 gap-2">
                            <div>
                              <label htmlFor="provider" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.provider.object")}
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  name="provider"
                                  id="provider"
                                  autoComplete="off"
                                  required
                                  value={providerFullName()}
                                  disabled
                                  className="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="client" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.client.object")}
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  name="client"
                                  id="client"
                                  autoComplete="off"
                                  required
                                  value={clientFullName()}
                                  disabled
                                  className="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="status" className="block text-xs font-medium text-gray-700 truncate">
                                {t("models.contract.status")}
                              </label>
                              <select
                                id="status"
                                name="status"
                                disabled={!editing}
                                className={classNames(
                                  "mt-1 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                                  !editing && "bg-gray-100",
                                  editing && "bg-white"
                                )}
                                defaultValue={status}
                                onChange={(e) => setStatus(Number(e.target.value))}
                              >
                                <option value={ContractStatus.PENDING}>{t("app.contracts.status.PENDING")}</option>
                                <option value={ContractStatus.SIGNED}>{t("app.contracts.status.SIGNED")}</option>
                                <option value={ContractStatus.ARCHIVED}>{t("app.contracts.status.ARCHIVED")}</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                              {t("models.contract.name")}
                            </label>
                            <div className="mt-1">
                              <input
                                disabled={!editing}
                                type="text"
                                ref={inputName}
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                className={classNames(
                                  "text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                                  !editing && "bg-gray-100",
                                  editing && "bg-white"
                                )}
                                placeholder={t("models.contract.name")}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2">
                              {t("models.contract.description")}
                            </label>
                            <div className="mt-1 sm:col-span-2">
                              <textarea
                                disabled={!editing}
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className={classNames(
                                  "p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md",
                                  !editing && "bg-gray-100",
                                  editing && "bg-white"
                                )}
                              ></textarea>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2">{t("models.contract.file")}</label>
                            <div className={classNames("mt-1 sm:col-span-2", editing && "bg-white")}>
                              {(() => {
                                if (loadingPdf) {
                                  return (
                                    <div className="overflow-hidden border border-gray-300 rounded-md items-center">
                                      <Loading />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div>
                                      {(() => {
                                        if (contractPdf && contractPdf.length > 0) {
                                          return <PdfViewer file={contractPdf} fileName={item.name} editing={editing} onRemoveFile={removeFile} />;
                                        } else {
                                          return (
                                            <UploadDocument
                                              accept=".pdf"
                                              description={t("shared.onlyFileTypes", [".PDF"])}
                                              onDroppedFiles={droppedContractFile}
                                              icon={<IconContract className="mx-auto h-10 w-10 text-gray-400" />}
                                            />
                                          );
                                        }
                                      })()}
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <ContractMembers items={item.members} />
                      {item.employees.length > 0 && <ContractEmployees items={item.employees} />}
                      <ContractActivity items={item.activity} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return <div></div>;
        }
      })()}
      <ConfirmModal ref={confirmSendContract} onYes={yesSendContract} />
      <ConfirmModal ref={confirmDelete} onYes={yesDelete} />
      <ErrorModal ref={errorModal} />
      <SuccessModal ref={successModal} />
    </div>
  );
}
