import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Theme } from "@/application/enums/shared/Theme";

import Landing from "@/views/front/Landing";
import Pricing from "@/views/front/Pricing";
import Contact from "@/views/front/Contact";
import Privacy from "@/views/front/PrivacyPolicy";
import Terms from "@/views/front/TermsAndConditions";
import Components from "@/views/front/Components";

import { Helmet, HelmetProvider } from "react-helmet-async";
import "@/locale/i18n";
import { useEffect } from "react";
import Login from "@/views/front/account/Login";
import Register from "@/views/front/account/Register";
import Invitation from "@/views/front/account/Invitation";
import Verify from "@/views/front/account/Verify";
import Forgot from "@/views/front/account/Forgot";
import Reset from "@/views/front/account/Reset";
import JoinTenant from "@/views/front/account/JoinTenant";
import AppIndex from "@/views/core/Index";

import AdminTenants from "@/views/admin/tenants/Index";
import AdminIndex from "./views/admin/Index";
import AdminTenant from "./views/admin/tenants/Tenant";
import AdminUsers from "./views/admin/Users";
import AdminPricing from "./views/admin/Pricing";
import AdminEmails from "./views/admin/Emails";
import AdminNavigation from "./views/admin/Navigation";
import AdminComponents from "./views/admin/Components";
import Dashboard from "./views/core/Dashboard";
import Settings from "./views/core/settings/Index";
import Profile from "./views/core/settings/Profile";
import Workspaces from "./views/core/settings/Workspaces";
import NewWorkspace from "./components/core/workspaces/NewWorkspace";
import EditWorkspace from "./components/core/workspaces/EditWorkspace";
import Members from "./views/core/settings/Members";
import NewMember from "./components/core/settings/members/NewMember";
import EditMember from "./components/core/settings/members/EditMember";
import Tenant from "./views/core/settings/Tenant";
import MySubscription from "./components/core/settings/subscription/MySubscription";
import Links from "./views/core/links/Index";
import AllLinksList from "./components/app/links/all/AllLinksList";
import PendingLinksList from "./components/app/links/pending/PendingLinksList";
import ProvidersList from "./components/app/links/providers/ProvidersList";
import ClientsList from "./components/app/links/clients/ClientsList";
import Link from "./views/core/links/Link";
import Employees from "./views/app/employees/Index";
import NewEmployees from "./views/app/employees/NewEmployees";
import Employee from "./views/app/employees/Employee";
import Contracts from "./views/app/contracts/Index";
import NewContract from "./views/app/contracts/NewContract";
import Contract from "./views/app/contracts/Contract";
import ScrollToTop from "./router/ScrollToTop";
import Unauthorized from "./views/core/Unauthorized";
import PrivateRoute from "./router/PrivateRoute";
import { UserType } from "./application/enums/core/users/UserType";
import { TenantUserRole } from "./application/enums/core/tenants/TenantUserRole";

export default function App() {
  const theme = useSelector<RootState>((state) => state.theme.value);

  useEffect(() => {
    const htmlClasses = document.querySelector("html")?.classList;
    if (theme === Theme.LIGHT) {
      htmlClasses?.remove("dark");
    } else {
      htmlClasses?.add("dark");
    }
  }, [theme]);

  return (
    <Router>
      <ScrollToTop />
      <HelmetProvider>
        <Helmet>
          <title>React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>

      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/components" element={<Components />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/invitation" element={<Invitation />} />
          <Route path="/join/:tenant" element={<JoinTenant />} />
        </Route>

        <Route path="/admin" element={<Navigate replace to="/admin/tenants" />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute userTypes={[UserType.Admin]}>
              <AdminIndex />
            </PrivateRoute>
          }
        >
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="tenant/:id" element={<AdminTenant />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="emails" element={<AdminEmails />} />
          <Route path="navigation" element={<AdminNavigation />} />
          <Route path="components" element={<AdminComponents />} />
        </Route>

        <Route path="/app" element={<Navigate replace to="/app/dashboard" />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <AppIndex />
            </PrivateRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="settings" element={<Settings />}>
            <Route path="profile" element={<Profile />} />
            <Route
              path="workspaces"
              element={
                <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                  <Workspaces />
                </PrivateRoute>
              }
            >
              <Route path="new" element={<NewWorkspace />} />
              <Route path="edit/:id" element={<EditWorkspace />} />
            </Route>
            <Route
              path="members"
              element={
                <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                  <Members />
                </PrivateRoute>
              }
            >
              <Route path="new" element={<NewMember />} />
              <Route path="edit/:id" element={<EditMember />} />
            </Route>
            <Route
              path="subscription"
              element={
                <PrivateRoute roles={[TenantUserRole.OWNER]}>
                  <MySubscription />
                </PrivateRoute>
              }
            />
            <Route
              path="tenant"
              element={
                <PrivateRoute roles={[TenantUserRole.OWNER]}>
                  <Tenant />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="links" element={<Navigate replace to="/app/links/all" />} />
          <Route
            path="links"
            element={
              <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                <Links />
              </PrivateRoute>
            }
          >
            <Route path="all" element={<AllLinksList />} />
            <Route path="pending" element={<PendingLinksList />} />
            <Route path="providers" element={<ProvidersList />} />
            <Route path="clients" element={<ClientsList />} />
          </Route>
          <Route
            path="link/:id"
            element={
              <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                <Link />
              </PrivateRoute>
            }
          />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route path="employees" element={<Employees />} />
          <Route path="employees/new" element={<NewEmployees />} />
          <Route path="employee/:id" element={<Employee />} />

          <Route path="contracts" element={<Navigate replace to="/app/contracts/pending" />} />
          <Route path="contracts/:status" element={<Contracts />}></Route>
          <Route
            path="contract/new"
            element={
              <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}>
                <NewContract />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="contract/:id"
            element={
              <PrivateRoute roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}>
                <Contract />
              </PrivateRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </Router>
  );
}
