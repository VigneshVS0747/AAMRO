import { createReducer, on } from '@ngrx/store';
import { setUserId } from './userId.action';


export interface AppState {
  userId: string ;
}

export const initialState: AppState = {
  userId:''
};

const _appReducer = createReducer(
  initialState,
  on(setUserId, (state, { userId }) => ({ ...state, userId }))
);

export function appReducer(state: AppState | undefined, action: any) {
  return _appReducer(state, action);
}