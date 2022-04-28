import { useTranslation } from "react-i18next";
import { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import ErrorModal, { RefErrorModal } from "@/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "@/components/ui/modals/SuccessModal";
import UploadImage from "@/components/ui/uploaders/UploadImage";
import services from "@/services";
import store, { RootState } from "@/store";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { setCurrentImage } from "@/store/modules/tenantReducer";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Tenant() {
  const { t } = useTranslation();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);

  const [name, setName] = useState<string>("");
  const [subdomain, setSubdomain] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [imageType] = useState("");
  const [imageCurrent] = useState("");
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getCurrentTenantInForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tenant = useSelector((state: RootState) => {
    return state.tenant.current;
  });

  function getCurrentTenantInForm() {
    setName(tenant?.name ?? "");
    setSubdomain(tenant?.subdomain ?? "");
    setDomain(tenant?.domain ?? "");
  }
  function updateTenant(e: FormEvent) {
    e.preventDefault();
    services.tenants
      .update({
        name,
        subdomain,
        domain,
      } as TenantDto)
      .then(() => {
        successModal.current?.show(t("shared.updated"), t("settings.tenant.updated"));
      })
      .catch((error) => {
        errorModal.current?.show(t("shared.error"), t(error));
      });
  }
  function loadedImage(image) {
    const payload: TenantUpdateImageRequest = {
      type: imageType,
      logo: imageType === "logo" ? image : "",
      icon: imageType === "icon" ? image : "",
      logoDarkmode: imageType === "logoDarkmode" ? image : "",
    };
    setUploadingImage(true);
    services.tenants
      .updateImage(payload)
      .then(() => {
        store.dispatch(
          setCurrentImage({
            imageType,
            image,
          })
        );
        setShowUploadImage(false);
      })
      .catch((error) => {
        console.error("Error: " + error);
      })
      .finally(() => {
        setUploadingImage(false);
      });
  }
  return (
    <div className="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <HelmetProvider>
        <Helmet>
          <title>{t("app.navbar.tenant")} | React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>
      <div className="md:grid lg:grid-cols-3 md:gap-2">
        <div className="md:col-span-1">
          <div className="sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{t("settings.tenant.general")}</h3>
            <p className="mt-1 text-xs leading-5 text-gray-600">{t("settings.tenant.generalDescription")}</p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={updateTenant} method="POST">
            <div className="shadow overflow-hidden sm:rounded-sm">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-6 sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                      {t("shared.name")}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      id="name"
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  {t("shared.save")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showUploadImage && !uploadingImage && (
        <UploadImage onClose={() => setShowUploadImage(false)} title={t("shared." + imageType)} initialImage={imageCurrent} onLoaded={loadedImage} />
      )}
      <SuccessModal ref={successModal} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
