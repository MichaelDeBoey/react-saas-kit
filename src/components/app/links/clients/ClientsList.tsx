import { useTranslation } from "react-i18next";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import Loading from "@/components/ui/loaders/Loading";
import services from "@/services";
import { useState, useEffect } from "react";
import ClientsListAndTable from "./ClientsListAndTable";

export default function ClientsList() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [items, setItems] = useState<LinkDto[]>([]);

  useEffect(() => {
    reload();
  }, []);

  function reload() {
    setLoading(true);
    services.links
      .getAllClients()
      .then((response) => {
        setItems(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const filteredItems = (items: LinkDto[]): LinkDto[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) => f.id?.toUpperCase().includes(searchInput.toUpperCase()) || f.clientWorkspace.name?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };

  return (
    <div>
      {(() => {
        if (loading) {
          return <Loading />;
        } else {
          return (
            <div>
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
                <ClientsListAndTable items={filteredItems(items)} />
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}
