import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserType } from "@/application/enums/core/users/UserType";
import i18n from "@/locale/i18n";
import store from "@/store";
import { resetAccountState, setLogged } from "@/store/modules/accountReducer";
import { resetAppState } from "@/store/modules/appReducer";
import { login, logout } from "@/store/modules/authReducer";
import { resetPricingState } from "@/store/modules/pricingReducer";
import { setMyTenants, setCurrent, resetTenantState } from "@/store/modules/tenantReducer";
import { NavigateFunction } from "react-router";

const avatarText = (user: UserDto | null): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      if (user.firstName.length > 0 && user.lastName.length > 0) {
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
      } else if (user.firstName.length > 1) {
        return user.firstName.substring(0, 2).toUpperCase();
      } else if (user.email.length > 1) {
        return user.email.substring(0, 2).toUpperCase();
      }
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
  }
  return "--";
};

const profileName = (user: UserDto | null): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      return user.firstName + " " + user.lastName;
    } else {
      return user.email;
    }
  }
  return "--";
};

const logged = (response: UserLoggedResponse, navigate: NavigateFunction) => {
  store.dispatch(login(response));
  const tenants = response.user.tenants.map((f) => f.tenant);
  const currentTenant = response.user.currentTenant;
  store.dispatch(setLogged(response.user));
  store.dispatch(setMyTenants(tenants));
  store.dispatch(setCurrent(currentTenant));
  if (response.user.locale) {
    localStorage.setItem("locale", response.user.locale);
    i18n.changeLanguage(response.user.locale ?? "en");
  }

  const redirect = new URLSearchParams(location.search).get("redirect");
  if (redirect) {
    navigate(redirect);
  } else {
    if ((response.user as UserDto).type === UserType.Admin && import.meta.env.VITE_REACT_APP_SERVICE !== "sandbox") {
      navigate("/admin");
    } else {
      navigate("/app/dashboard");
    }
  }
};

const loggedOut = (navigate: NavigateFunction) => {
  store.dispatch(logout());
  store.dispatch(resetAccountState());
  store.dispatch(resetPricingState());
  store.dispatch(resetTenantState());
  store.dispatch(resetAppState());
  localStorage.clear();
  navigate("/");
};

export default {
  avatarText,
  profileName,
  logged,
  loggedOut,
};
