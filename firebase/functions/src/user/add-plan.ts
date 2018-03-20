import * as admin from 'firebase-admin';

export const setBetaPlan = userId =>
  admin
    .database()
    .ref(`/users/${userId}/plan`)
    .update({ plan_id: 'beta', created_at: Date.now() });
