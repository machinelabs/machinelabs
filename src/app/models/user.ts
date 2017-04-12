export interface LoginUser {
  uid: string;
  displayName: string|null;
  email: string|null;
  isAnonymous: boolean;
  photoURL: string|null;
  providerData?: Array<any>;
}

export interface User {
  id: string;
  displayName: string|null;
  email: string|null;
  isAnonymous: boolean;
  photoUrl: string|null;
}
