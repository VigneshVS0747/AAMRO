import { createAction, props } from "@ngrx/store";

export const setGuardPrivileges = createAction(
  "setGuardPrivileges",
  props<{ value: any }>()
);
