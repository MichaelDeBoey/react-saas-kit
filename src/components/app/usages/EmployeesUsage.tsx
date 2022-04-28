import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import services from "@/services";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function EmployeesUsage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    services.tenants.getCurrentUsage(AppUsageType.EMPLOYEES).finally(() => {
      setLoading(false);
    });
  }, []);
  const employees = useSelector((state: RootState) => {
    return state.app.usage.employees;
  });

  return (
    <Link to="/app/employees" className="px-4 py-5 border shadow-md rounded-lg overflow-hidden sm:p-6 bg-white border-gray-300 hover:bg-gray-50">
      <div>
        <dt className="text-sm font-medium text-gray-500 truncate">{t("models.employee.plural")}</dt>
        {(() => {
          if (loading) {
            return <dd className="mt-1 text-xl font-semibold text-gray-900">...</dd>;
          } else {
            return (
              <dd className="mt-1 text-gray-900 truncate">
                <span className="text-xl font-semibold">{employees}</span>
              </dd>
            );
          }
        })()}
      </div>
    </Link>
  );
}
