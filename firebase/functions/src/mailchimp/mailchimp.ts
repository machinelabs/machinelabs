import * as MailChimpApi from 'mailchimp-api-v3';

export class MailChimp {
  mailchimp = null;

  constructor(apiKey: string) {
    this.mailchimp = new MailChimpApi(apiKey);
  }

  addUserToList(user, listId) {
    return this.mailchimp.post(`/lists/${listId}/members`, {
      email_address: user.email,
      status: 'subscribed',
      merge_fields: {
        DNAME: user.displayName,
        ID: user.id
      }
    });
  }
}
