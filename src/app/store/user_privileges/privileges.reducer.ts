import { createReducer, on } from "@ngrx/store";
import { setPrivileges } from "./privileges.actions";
import { initialState } from "./privileges.state";

const _privilegeReducer = createReducer(
  initialState,
  on(setPrivileges, (state, action) => {
    return {
      ...state,
      privileges: action.value,
    };
  })
);

export function privilegeReducer(state: any, action: any) {
  return _privilegeReducer(state, action);
}
