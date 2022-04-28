import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TenantState } from "../types";

const initialState: TenantState = {
  tenants: [],
  current: null,
  subscription: null,
  members: [],
  workspaces: [],
  currentWorkspace: null,
  features: null,
};

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    hydrate: (state, action) => {
      return action.payload;
    },
    resetTenantState: (state: TenantState) => {
      state.tenants = [];
      state.current = null;
      state.subscription = null;
      state.members = [];
      state.workspaces = [];
      state.currentWorkspace = null;
      state.features = null;
    },
    setMyTenants: (state: TenantState, { payload }: PayloadAction<TenantDto[]>) => {
      state.tenants = payload;
    },
    setCurrent: (state: TenantState, { payload }: PayloadAction<TenantDto>) => {
      state.current = payload;
    },
    setCurrentWorkspace: (state: TenantState, { payload }: PayloadAction<WorkspaceDto>) => {
      state.currentWorkspace = payload;
    },
    setCurrentImage: (state: TenantState, { payload }: PayloadAction<{ imageType: string; image: string }>) => {
      if (state.current) {
        if (payload.imageType === "icon") {
          state.current.icon = payload.image;
        } else if (payload.imageType === "logo") {
          state.current.logo = payload.image;
        } else if (payload.imageType === "logoDarkmode") {
          state.current.logoDarkmode = payload.image;
        }
      }
    },
    setSubscription: (state: TenantState, { payload }: PayloadAction<SubscriptionGetCurrentResponse>) => {
      state.subscription = payload;
      if (payload) {
        if (state.tenants && payload.customer) {
          state.tenants.forEach((tenant) => {
            if (tenant.subscriptionCustomerId === payload.customer.id) {
              tenant.products = payload.myProducts;
            }
          });
        }
      }
    },
    setMembers(state: TenantState, { payload }: PayloadAction<TenantUserDto[]>) {
      state.members = payload;
    },
    setWorkspaces(state: TenantState, { payload }: PayloadAction<WorkspaceDto[]>) {
      state.workspaces = payload;
      if (state.currentWorkspace) {
        if (!payload.find((f) => f.id === state.currentWorkspace?.id)) {
          state.currentWorkspace = null;
        }
      }
      if (payload?.length > 0 && !state.currentWorkspace) {
        const defaultWorkspace = payload.find((f) => f.default);
        if (defaultWorkspace) {
          state.currentWorkspace = defaultWorkspace;
        } else {
          state.currentWorkspace = payload[0];
        }
      }
    },
    setSettings(state: TenantState, { payload }: PayloadAction<TenantDto>) {
      if (state.current) {
        state.current.name = payload.name;
        state.current.subdomain = payload.subdomain;
      }
    },
  },
});

export const {
  resetTenantState,
  setMyTenants,
  setCurrent,
  setCurrentWorkspace,
  setCurrentImage,
  setSubscription,
  setMembers,
  setWorkspaces,
  setSettings,
  hydrate,
} = tenantSlice.actions;

export default tenantSlice.reducer;
