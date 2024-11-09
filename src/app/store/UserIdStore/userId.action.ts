import { createAction, props } from '@ngrx/store';

export const setUserId = createAction(
  'SetUserId',
  props<{ userId: string }>()
);