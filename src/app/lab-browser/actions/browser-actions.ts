import {Lab, LabExecutionContext, File} from '../../lab/models/lab';
import {User} from '../../api/models/user';

import {
  LabBrowserAction,
  LabBrowserActionTypes
} from './actions';

//  ********************************
//  Labe Action Creators
//  ********************************

export function configLabAction(context: LabExecutionContext): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_CONFIG, target: context};
}
export function runLabAction(lab: Lab): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_RUN, target: lab};
}

export function stopLabAction(context: LabExecutionContext): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_STOP, target: context};
}

export function saveLabAction(lab: Lab): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_SAVE, target: lab};
}

export function forkLabAction(lab: Lab): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_FORK, target: lab};
}

export function shareLabAction(lab: Lab): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_SHARE, target: lab};
}

export function embedLabAction(lab: Lab): LabBrowserAction {
  return {type: LabBrowserActionTypes.LAB_EMBED, target: lab};
}

//  ********************************
//  File Action Creates
//  ********************************

export function openFileAction(file: File): LabBrowserAction {
  return {type: LabBrowserActionTypes.FILE_OPEN, target: file};
}

export function addFileAction(file?:File): LabBrowserAction {
  return {type: LabBrowserActionTypes.FILE_ADD, target: file};
}

export function deleteFileAction(file: File): LabBrowserAction {
  return {type: LabBrowserActionTypes.FILE_DELETE, target: file};
}

export function browseFilesAction(): LabBrowserAction {
  return {type: LabBrowserActionTypes.FILE_BROWSE};
}



//  ********************************
//  user Action Creates
//  ********************************

export function loginUserAction(user:User): LabBrowserAction {
  return {type: LabBrowserActionTypes.USER_LOGIN, target: user};
}

export function logoutUserAction(user:User): LabBrowserAction {
  return {type: LabBrowserActionTypes.USER_LOGOUT, target: user};
}

export function viewUserProfileAction(user:User): LabBrowserAction {
  return {type: LabBrowserActionTypes.USER_PROFILE, target: user};
}

//  ********************************
//  View Action Creates
//  ********************************

export function hideNavigator(): LabBrowserAction {
  return {type: LabBrowserActionTypes.HIDE_SIDEBAR};
}

export function showNavigator(): LabBrowserAction {
  return {type: LabBrowserActionTypes.SHOW_SIDEBAR};
}
