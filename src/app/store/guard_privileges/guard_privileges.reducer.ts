import { createReducer, on } from "@ngrx/store";
import { initialState } from "./guard_privileges.state";
import { setGuardPrivileges } from "./guard_privileges.action";

const _privilegeGuardReducer = createReducer(
  initialState,
  on(setGuardPrivileges, (state, action) => {
    return {
      ...state,
      guardPrivileges: action.value,
    };
  })
);

export function privilegeGuardReducer(state: any, action: any) {
  return _privilegeGuardReducer(state, action);
}
