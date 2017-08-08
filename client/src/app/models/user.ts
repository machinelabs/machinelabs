export interface AuthProvider {
  uid: string|null;
  providerId: string|null;
  displayName: string|null;
  email: string|null;
  photoURL: string|null;
}

export interface LoginUser {
  uid: string;
  displayName: string|null;
  email: string|null;
  isAnonymous: boolean;
  photoURL: string|null;
  providerData?: Array<AuthProvider>;
}

export interface User {
  id: string;
  displayName: string|null;
  email: string|null;
  bio?: string|null;
  isAnonymous: boolean;
  photoUrl: string|null;
  providers: Array<string>|null;
}
