import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { UserType } from "@/application/enums/core/users/UserType";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: JSX.Element;
  userTypes?: UserType[];
  roles?: TenantUserRole[];
}

const PrivateRoute = ({ children, userTypes, roles }: Props) => {
  const location = useLocation();

  const authenticated = useSelector((state: RootState) => state.auth.authenticated);
  const currentType = useSelector((state: RootState) => state.account.user?.type);
  const currentRole = useSelector((state: RootState) => state.tenant.current?.currentUser.role);

  if (!authenticated) {
    const redirect = "/login?redirect=" + location.pathname;
    return <Navigate to={redirect} />;
  }

  if (userTypes && !userTypes.some((f) => f === currentType)) {
    return <Navigate to="/app/unauthorized" />;
  }

  if (userTypes && !userTypes.some((f) => f === currentType)) {
    return <Navigate to="/app/unauthorized" />;
  }

  if (roles && !roles.some((f) => f === currentRole)) {
    return <Navigate to="/app/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
