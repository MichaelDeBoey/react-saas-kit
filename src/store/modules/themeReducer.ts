import { Theme } from "@/application/enums/shared/Theme";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeState } from "../types";

let theme = { value: Theme.LIGHT };
try {
  let local: any = localStorage.getItem("theme");
  if (Number(local) === 0 || Number(local) === 1) {
    local = {
      value: Number(local),
    };
  }
  theme = JSON.parse(local ?? "{}") ?? {
    value: Theme.LIGHT,
  };
} catch {
  //
}
const initialState: ThemeState = theme;

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    hydrate: (state, action) => {
      // do not do state = action.payload it will not update the store
      return action.payload;
    },
    setTheme: (state, { payload }: PayloadAction<Theme>) => {
      state.value = payload;
      localStorage.setItem("theme", JSON.stringify(state.value));
    },
  },
});

export const { setTheme, hydrate } = themeSlice.actions;

export default themeSlice.reducer;
