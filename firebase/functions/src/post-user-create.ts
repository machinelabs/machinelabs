import { database, config } from 'firebase-functions';

import { Change, Runnable, TriggerAnnotated } from 'firebase-functions/lib/cloud-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { setBetaPlan } from './user/add-plan';
import { MailChimp } from './mailchimp/mailchimp';

const mailchimpConfig = config().mailchimp;
let mailchimp;

if (!mailchimpConfig) {
  console.warn('MailChimp config not set. For production make sure this is correctly configured.');
} else {
  mailchimp = new MailChimp(mailchimpConfig.api_key);
}

export const postUserCreate = database.ref('/users/{id}/common').onCreate((snap, context) => {
  const user = snap.val();
  console.log(`Subscribing user to MailChimp and adding 'beta' plan`, user);
  return Promise.all([
    mailchimp ? mailchimp.addUserToList(user, mailchimpConfig.all_users_list_id) : Promise.resolve(),
    setBetaPlan(user.id)
  ]);
});
