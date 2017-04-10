export interface LoginUser {
  uid: string;
  displayName: string|null;
  email: string|null;
  isAnonymous: boolean;
  photoUrl: string|null;
}
