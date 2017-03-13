import {File, Lab, LabExecutionContext} from '../../lab/models/lab';
import {User} from '../../api/models/user';

// /**
//  * Create pseudo-Enums with string values
//  */
// function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
//   return o.reduce((res, key) => {
//     res[key] = key;
//     return res;
//   }, { });
// }
//
// export const FileActionTypes = strEnum(['OPEN', 'DELETE', 'ADD']);
// export const LabActionTypes = strEnum(['RUN', 'STOP', 'FORK', 'SAVE']);
// export const UserActionTypes = strEnum(['LOGIN', 'LOGOUT']);
//
// export interface LabBrowserAction {
//   type: string,
//   target: File | Lab | User | LabExecutionContext
// }


export enum LabBrowserActionTypes {
  FILE_OPEN = 1, FILE_DELETE, FILE_ADD, FILE_BROWSE,
  LAB_CONFIG, LAB_RUN, LAB_STOP, LAB_FORK, LAB_SAVE, LAB_SHARE, LAB_EMBED,
  USER_LOGIN, USER_LOGOUT, USER_PROFILE,
  HIDE_SIDEBAR, SHOW_SIDEBAR,

};

export interface LabBrowserAction {
  type : LabBrowserActionTypes,
  target? : any;    //File | Lab | User | LabExecutionContext
}
