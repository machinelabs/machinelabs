export interface ExtendedUser {
  common: User,
  plan: UserPlan
}

export interface UserPlan {
  plan_id: string;
}

export interface User {
  id: string;
  displayName: string|null;
  email: string|null;
  isAnonymous: boolean;
  photoUrl: string|null;
}