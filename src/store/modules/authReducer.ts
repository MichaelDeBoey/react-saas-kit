import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../types";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";

const initialState: AuthState = {
  authenticated: false,
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate: (_state, action) => {
      return action.payload;
    },
    login: (state, { payload }: PayloadAction<UserLoggedResponse>) => {
      state.authenticated = true;
      state.token = payload.token;

      try {
        // Google Analytics

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.analytics) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.analytics.identify(payload.user.username, {
            email: payload.user.email,
            firstName: payload.user.firstName,
            lastName: payload.user.lastName,
            tenant: payload.user.currentTenant,
          });
        }
        // if (mixpanel) {
        //   try {
        //     mixpanel.identify(payload.user.id);
        //     if (mixpanel.people) {
        //       mixpanel.people.set({
        //         USER_ID: payload.user.id,
        //         $email: payload.user.email,
        //         "First name": payload.user.firstName,
        //         "Last name": payload.user.lastName,
        //       });
        //     }
        //     mixpanel.track("Login");
        //   } catch (ex) {
        //     // ignore
        //   }
        // }
        // if (LogRocket) {
        //   LogRocket.identify(payload.user.email, {
        //     username: payload.user.username,
        //     firstName: payload.user.firstName,
        //     lastName: payload.user.lastName,
        //     email: payload.user.email,
        //     subscriptionCustomerId:
        //       payload.user.currentTenant?.subscriptionCustomerId ?? "",
        //     subscriptionPlanId:
        //       payload.user.currentTenant?.subscriptionPlanId ?? "",
        //   });
        // }
      } catch (ex) {
        // ignore
      }
    },
    logout: (state) => {
      state.authenticated = false;
      state.token = "";
    },
  },
});

export const { login, logout, hydrate } = authSlice.actions;

export default authSlice.reducer;
