import { useTranslation } from "react-i18next";
import { ReactNode, useEffect, useRef, useState } from "react";
import ErrorModal, { RefErrorModal } from "../ui/modals/ErrorModal";
import NewLink, { RefNewLink } from "./links/pending/NewLink";
import services from "@/services";
import { useNavigate } from "react-router";
import tinyEventBus from "@/plugins/tinyEventBus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
import StackedLayout from "../layouts/StackedLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import TenantNew from "../core/settings/tenant/TenantNew";

interface Props {
  layout: "app" | "admin";
  children: ReactNode;
}

export default function AppLayout({ layout, children }: Props) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const newLink = useRef<RefNewLink>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const [addingTenant, setAddingTenant] = useState(false);

  useEffect(() => {
    services.tenants.getAll();
    services.workspaces.getAllWorkspaces(true).then((response) => {
      if (response.length === 0) {
        errorModal.current?.show(t("app.workspaces.errors.noWorkspaces"), t("app.workspaces.errors.addAtLeastOneWorkspace"));
        navigate("/app/settings/workspaces");
      }
    });

    tinyEventBus().emitter.on("view-pending-invitations", () => {
      navigate("/app/links/pending");
    });
    tinyEventBus().emitter.on("new-provider", () => {
      newLink.current?.show(false, false);
    });
    tinyEventBus().emitter.on("new-client", () => {
      newLink.current?.show(true, false);
    });
    tinyEventBus().emitter.on("new-link", () => {
      newLink.current?.show(true, true);
    });

    return () => {
      tinyEventBus().emitter.off("view-pending-invitations");
      tinyEventBus().emitter.off("view-pending-links");
      tinyEventBus().emitter.off("view-links-information");
      tinyEventBus().emitter.off("new-provider");
      tinyEventBus().emitter.off("new-client");
      tinyEventBus().emitter.off("new-link");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWorkspaceId = useSelector((state: RootState): string => {
    return state.tenant.currentWorkspace?.id ?? "";
  });
  const currentLayout = useSelector((state: RootState): ApplicationLayout => {
    return state.app.layout;
  });

  return (
    <div key={currentWorkspaceId}>
      {(() => {
        if (currentLayout === ApplicationLayout.STACKED) {
          return <StackedLayout layout={layout}>{children}</StackedLayout>;
        } else {
          return (
            <SidebarLayout layout={layout} onAddTenant={() => setAddingTenant(true)}>
              {children}
            </SidebarLayout>
          );
        }
      })()}

      {(() => {
        if (addingTenant) {
          return (
            <TenantNew
              close={() => {
                setAddingTenant(false);
              }}
            />
          );
        }
      })()}

      <NewLink ref={newLink} asProvider={false} selectType={false} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
