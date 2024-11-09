import { createAction, props } from "@ngrx/store";

export const setPrivileges = createAction(
  "setPrivileges",
  props<{ value: any }>()
);
