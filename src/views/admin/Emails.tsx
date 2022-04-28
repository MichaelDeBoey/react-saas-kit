import { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import Loading from "@/components/ui/loaders/Loading";
import i18n from "@/locale/i18n";
import services from "@/services";
import classNames from "@/utils/shared/ClassesUtils";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Emails() {
  const { t } = useTranslation();

  const [items, setItems] = useState<EmailTemplateDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [canCreateEmailTemplates, setCanCreateEmailTemplates] = useState(false);
  const headers = [
    {
      title: i18n.t("admin.emails.created"),
    },
    {
      title: i18n.t("admin.emails.name"),
    },
    {
      title: i18n.t("admin.emails.alias"),
    },
    {
      title: i18n.t("admin.emails.subject"),
    },
    {
      title: i18n.t("shared.actions"),
    },
  ];

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    setLoading(true);
    setCanCreateEmailTemplates(false);
    services.setup
      .getPostmarkTemplates()
      .then((response) => {
        setItems(response);
        if (response.filter((f) => !f.created).length > 0) {
          setCanCreateEmailTemplates(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function createAll() {
    setLoading(true);
    services.setup
      .createPostmarkTemplates()
      .then(() => {
        reload();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }
  function templateUrl(item: EmailTemplateDto) {
    return `https://account.postmarkapp.com/servers/${item.associatedServerId}/templates/${item.templateId}/edit`;
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{t("admin.emails.title")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">{t("admin.emails.title")}</h1>
          <div className="flex items-center space-x-2">
            <ButtonSecondary disabled={loading} onClick={reload}>
              {t("shared.reload")}
            </ButtonSecondary>
            <ButtonSecondary disabled={loading || !canCreateEmailTemplates} onClick={createAll}>
              {t("admin.emails.createAll")}
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
              <div className="flex flex-col">
                {(() => {
                  if (items.length === 0) {
                    return (
                      <EmptyState
                        className="bg-white"
                        captions={{
                          thereAreNo: t("admin.emails.noEmails"),
                          description: t("admin.emails.noEmailsDescription"),
                        }}
                      />
                    );
                  } else {
                    return (
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
                                        className="text-xs px-3 py-2 max-w-xs text-left font-medium text-gray-500 tracking-wider select-none truncate"
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
                                {items.map((item, idx) => {
                                  return (
                                    <tr key={idx}>
                                      <td className="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex justify-center">
                                          {(() => {
                                            if (item.created) {
                                              return (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-4 w-4 text-theme-600"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              );
                                            } else {
                                              return (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-4 w-4 text-gray-300"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              );
                                            }
                                          })()}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.name}</td>
                                      <td className="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.alias}</td>
                                      <td className="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">{item.subject}</td>
                                      <td className="px-3 py-2 max-w-xs truncate whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                          {item.created && (
                                            <a
                                              href={templateUrl(item)}
                                              target="_blank"
                                              rel="noreferrer"
                                              className={classNames(
                                                item.created && "text-theme-600 hover:text-theme-800 hover:underline",
                                                !item.created && "text-gray-300 cursor-not-allowed"
                                              )}
                                            >
                                              {t("shared.edit")}
                                            </a>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
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
