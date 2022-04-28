import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import SelectEmployees, { RefSelectEmployees } from "@/components/app/employees/SelectEmployees";
import SelectContractMembers, { RefSelectContractMembers } from "@/components/app/contracts/SelectContractMembers";
import LinkSelector, { RefLinkSelector } from "@/components/app/links/selectors/LinkSelector";
import { AddContractMemberDto } from "@/application/contracts/app/contracts/AddContractMemberDto";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import services from "@/services";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import store, { RootState } from "@/store";
import { useSelector } from "react-redux";
import { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import classNames from "@/utils/shared/ClassesUtils";
import IconWorkers from "@/assets/icons/IconWorkers";
import IconSign from "@/assets/icons/IconSign";
import UploadDocument from "@/components/ui/uploaders/UploadDocument";
import IconContract from "@/assets/icons/IconContract";
import WarningBanner from "@/components/ui/banners/WarningBanner";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb";
import Loading from "@/components/ui/loaders/Loading";
import { updateItem } from "@/utils/shared/ObjectUtils";
import PdfPreview from "@/components/ui/pdf/PdfViewer";

export default function NewContract() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useLocation().search;
  const preselectLinkIdQueryParam = new URLSearchParams(search).get("l") ?? "";

  const inputName = useRef<HTMLInputElement>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const confirmCreate = useRef<RefConfirmModal>(null);
  const selectEmployees = useRef<RefSelectEmployees>(null);
  const selectContractMembers = useRef<RefSelectContractMembers>(null);
  const linkSelector = useRef<RefLinkSelector>(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState<LinkDto | null>(null);
  const [linkId, setLinkId] = useState("");
  const [description, setDescription] = useState("");
  const [contractFile, setContractFile] = useState("");
  const [members, setMembers] = useState<AddContractMemberDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [preselectLinkId, setPreselectLinkId] = useState("");

  useEffect(() => {
    setPreselectLinkId(preselectLinkIdQueryParam);
    if (preselectLinkId) {
      services.links.get(preselectLinkId).then((link) => {
        linkSelector.current?.select(link);
      });
    }
    loadFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadFeatures() {
    services.tenants.getCurrentUsage(AppUsageType.CONTRACTS);
    services.tenants.getFeatures();
  }
  function addMember() {
    if (!link || !link.id) {
      errorModal.current?.show(t("shared.missingFields"), t("app.contracts.errors.linkRequired"));
    } else {
      selectContractMembers.current?.show(
        link,
        link?.id,
        members.map((f) => f.userId)
      );
    }
  }
  function addEmployee() {
    selectEmployees.current?.show(employees.map((f) => f.id));
  }
  function removeFile() {
    setContractFile("");
  }
  function removeMember(index) {
    setMembers(members.filter((_x, i) => i !== index));
  }
  function removeEmployee(index) {
    setEmployees(employees.filter((_x, i) => i !== index));
  }
  function save() {
    if (maxContractsReached()) {
      errorModal.current?.show(t("shared.error"), t("app.subscription.errors.limitReachedContracts"));
    } else if (!link || !link.id) {
      errorModal.current?.show(t("shared.missingFields"), t("app.contracts.errors.linkRequired"));
      return;
    } else if (!name) {
      errorModal.current?.show(t("shared.missingFields"), t("app.contracts.errors.nameRequired"));
      return;
    } else if (!description) {
      errorModal.current?.show(t("app.contracts.errors.descriptionRequired"));
      return;
    } else if (!contractFile) {
      errorModal.current?.show(t("shared.missingFields"), t("app.contracts.errors.fileRequired"));
    } else if (!members || members.filter((f) => f.role === ContractMemberRole.SIGNATORY).length < 2) {
      errorModal.current?.show(t("shared.missingFields"), t("app.contracts.errors.atLeastNSignatories"));
      return;
    } else {
      confirmCreate.current?.show(t("app.contracts.actions.create"), t("shared.create"), t("shared.cancel"), t("app.contracts.actions.createDescription"));
    }
  }
  function saveContract() {
    setLoading(true);
    services.contracts
      .create({
        linkId,
        // clientWorkspaceId: clientWorkspaceId,
        name,
        description,
        file: contractFile,
        members,
        employees,
      })
      .then((response: ContractDto) => {
        navigate("/app/contract/" + response.id);
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function droppedContractFile(files: FileBase64[]) {
    if (files.length > 0) {
      const mb = files[0].file.size / 1048576;
      if (mb >= 20) {
        errorModal.current?.show(t("shared.error"), t("app.contracts.errors.maxFileReached"));
      } else {
        setContractFile(files[0].base64);
      }
    }
  }
  function selectedLink(id: string, _link: LinkDto) {
    setLinkId(id);
    setLink(_link);
    // nextTick(() => {
    inputName.current?.focus();
    inputName.current?.select();
    // });
  }
  function selectedEmployees(items: EmployeeDto[]) {
    setEmployees(items);
  }
  function selectedContractMembers(items: AddContractMemberDto[]) {
    setMembers(items);
  }
  const imProvider = () => {
    const { tenant } = store.getState();
    return tenant.currentWorkspace?.id === link?.providerWorkspaceId;
  };
  const features = useSelector((state: RootState): TenantFeaturesDto => {
    return state.app.features;
  });
  const usage = useSelector((state: RootState): AppUsageSummaryDto => {
    return state.app.usage;
  });
  const maxContractsReached = () => {
    if (!features) {
      return true;
    } else {
      return features.monthlyContracts > 0 && usage.contracts >= features.monthlyContracts;
    }
  };

  return (
    <div>
      <Breadcrumb
        menu={[
          {
            title: t("app.contracts.title"),
            routePath: "/app/contracts/pending",
          },
          {
            title: t("app.contracts.new.title"),
            routePath: "/app/contract/new",
          },
        ]}
      />
      <div className="lg:py-8 max-w-2xl mx-auto">
        {(() => {
          if (loading) {
            return <Loading />;
          } else {
            return (
              <div>
                {(() => {
                  if (maxContractsReached()) {
                    return (
                      <div>
                        <WarningBanner
                          redirect="/app/settings/subscription"
                          title={t("app.subscription.errors.limitReached")}
                          text={t("app.subscription.errors.limitReachedContracts", [features.monthlyContracts])}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <form>
                        <div className="sm:space-y-4 divide-y divide-gray-200">
                          <div className="bg-white py-6 px-8 shadow-lg border border-gray-200 space-y-6">
                            <div className="flex items-center space-x-3 justify-between">
                              <div>
                                <div>
                                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t("app.contracts.new.title")}</h3>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{t("app.contracts.new.description")}</p>
                              </div>
                              <IconContract className="h-8 w-8 text-gray-800" />
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-6">
                                <label htmlFor="link" className="block text-xs font-medium text-gray-700 truncate">
                                  {t("models.link.object")}
                                </label>
                                <LinkSelector ref={linkSelector} className="mt-1 w-full" onSelected={selectedLink} />
                              </div>

                              <div className="sm:col-span-6">
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 truncate">
                                  {t("shared.name")}
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm w-full">
                                  <input
                                    id="name"
                                    ref={inputName}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    required
                                    placeholder={t("app.contracts.placeholders.name")}
                                    className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-xs font-medium text-gray-700 truncate">
                                  {t("shared.description")}
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm w-full">
                                  <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    autoComplete="off"
                                    required
                                    placeholder={t("app.contracts.placeholders.description")}
                                    className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-6">
                                <label className="block text-xs font-medium text-gray-700 truncate">{t("shared.file")}</label>
                                <div className="mt-1">
                                  {(() => {
                                    if (contractFile) {
                                      return <PdfPreview file={contractFile} editing={true} onRemoveFile={removeFile} />;
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
                              </div>
                            </div>
                          </div>

                          <div className="bg-white py-6 px-8 shadow-lg border border-gray-200">
                            <div className="flex items-center space-x-3 justify-between">
                              <div>
                                <div>
                                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t("app.contracts.signatories")}</h3>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{t("app.contracts.new.addSignatories")}.</p>
                              </div>
                              <IconSign className="h-8 w-8 text-gray-800" />
                            </div>
                            <div>
                              {members.map((member, idxMember) => {
                                return (
                                  <div key={idxMember} className="grid grid-cols-6 items-center space-x-2 relative py-3 gap-1">
                                    <button
                                      type="button"
                                      disabled={members.length <= 1}
                                      className={classNames(
                                        "absolute origin-top-right right-0 top-0 mt-1 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500",
                                        members.length <= 1 && "text-gray-400 cursor-not-allowed",
                                        members.length > 1 && "text-gray-700 hover:bg-gray-50"
                                      )}
                                      onClick={() => removeMember(idxMember)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                    <div className="col-span-6 sm:col-span-2">
                                      <label htmlFor="full-name" className="block text-xs font-medium text-gray-700 truncate">
                                        {t("account.shared.fullName")}
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          id="full-name"
                                          // :ref="'fullName-' + idxMember"
                                          value={member.name}
                                          required
                                          type="text"
                                          name="full-name"
                                          placeholder={t("account.shared.name")}
                                          disabled
                                          autoComplete="full-name"
                                          className="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-span-3 sm:col-span-2">
                                      <div className="flex items-start space-x-2">
                                        <div className="flex-grow">
                                          <label htmlFor="email" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("account.shared.email")}
                                          </label>
                                          <div className="mt-1">
                                            <input
                                              id="email"
                                              value={member.email}
                                              name="email"
                                              type="email"
                                              disabled
                                              placeholder={
                                                member.role === 0
                                                  ? t("app.contracts.placeholders.signatoryEmail")
                                                  : t("app.contracts.placeholders.spectatorEmail")
                                              }
                                              autoComplete="email"
                                              required
                                              className="bg-gray-100 cursor-not-allowed shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-span-3 sm:col-span-2">
                                      <div className="flex items-start space-x-2">
                                        <div className="flex-grow">
                                          <label htmlFor="role" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("shared.role")}
                                          </label>
                                          <div className="mt-1">
                                            <select
                                              id="role"
                                              value={member.role}
                                              onChange={(e) => {
                                                updateItem(
                                                  members,
                                                  setMembers,
                                                  member.userId,
                                                  {
                                                    role: Number(e.target.value),
                                                  },
                                                  "userId"
                                                );
                                                // const index = members.findIndex((x) => x.userId === member.userId);
                                                // const updated = members[index];
                                                // updated.role = Number(e.target.value);
                                                // setMembers([...members.slice(0, index), updated, ...members.slice(index + 1)]);
                                              }}
                                              autoComplete="email"
                                              className="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            >
                                              <option value={0}>{t("app.contracts.signatory")}</option>
                                              <option value={1}>{t("app.contracts.spectator")}</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <button type="button" onClick={addMember} className="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="uppercase font-medium">{t("app.contracts.actions.selectSignatoryOrSpectator")}</span>
                              </button>
                            </div>
                          </div>

                          {imProvider() && (
                            <div className="bg-white py-6 px-8 shadow-lg border border-gray-200">
                              <div className="flex items-center space-x-3 justify-between">
                                <div>
                                  <h3 className="text-lg leading-6 font-medium text-gray-900">{t("models.employee.plural")}</h3>
                                  <p className="mt-1 text-sm text-gray-500">{t("app.employees.actions.select")}.</p>
                                </div>
                                <IconWorkers className="h-8 w-8 text-gray-400" />
                              </div>
                              <div>
                                <div>
                                  {employees.map((employee, idxEmployee) => {
                                    return (
                                      <div key={idxEmployee} className="relative mt-1 grid grid-cols-6 items-center space-x-2 py-3 gap-1">
                                        <button
                                          type="button"
                                          className="text-gray-700 hover:bg-gray-50 absolute origin-top-right right-0 top-0 mr-0 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                                          onClick={() => removeEmployee(idxEmployee)}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                        <div className="col-span-6 sm:col-span-2">
                                          <label htmlFor="full-name" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("models.employee.fullName")}
                                          </label>
                                          <div className="mt-1">
                                            <input
                                              id="employee-first-name-"
                                              // :ref="'employee-first-name-' + idxEmployee"
                                              value={employee.firstName}
                                              type="text"
                                              name="employee-first-name-"
                                              placeholder={t("models.employee.object") + " " + (idxEmployee + 1)}
                                              autoComplete="off"
                                              required
                                              disabled
                                              className="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                          <label htmlFor="full-name" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("models.employee.lastName")}
                                          </label>
                                          <div className="mt-1">
                                            <input
                                              id="employee-last-name"
                                              value={employee.lastName}
                                              type="text"
                                              name="employee-last-name"
                                              autoComplete="off"
                                              required
                                              disabled
                                              className="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2">
                                          <label htmlFor="email" className="block text-xs font-medium text-gray-700 truncate">
                                            {t("models.employee.email")}
                                          </label>
                                          <div className="mt-1">
                                            <input
                                              id="email"
                                              value={employee.email}
                                              type="text"
                                              name="email"
                                              autoComplete="off"
                                              required
                                              disabled
                                              className="bg-gray-100 cursor-not-allowed text-gray-800 shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  <div className="flex items-center space-x-3">
                                    <button type="button" onClick={addEmployee} className="mt-6 flex items-center space-x-1 text-xs text-theme-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                      </svg>
                                      <span className="uppercase font-medium">{t("app.employees.actions.selectEmployees")}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="py-5">
                          <div className="flex justify-end py-3 px-4 lg:px-0 lg:py-0">
                            <Link
                              to="/app/contracts/pending"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >
                              {t("shared.cancel")}
                            </Link>
                            <button
                              type="button"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                              onClick={save}
                            >
                              {t("app.contracts.new.save")}
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  }
                })()}
              </div>
            );
          }
        })()}
      </div>
      <SelectEmployees ref={selectEmployees} onSelected={selectedEmployees} />
      <SelectContractMembers ref={selectContractMembers} onSelected={selectedContractMembers} />
      <ConfirmModal ref={confirmCreate} onYes={saveContract} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
