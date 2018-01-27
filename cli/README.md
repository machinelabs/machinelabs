## MachineLabs  CLI

This is an alpha state CLI for the MachineLabs platform

### How to get this running locally

1. Setup your firebase cloud functions with a service account

Run `firebase use <my-fb>` followed by `firebase functions:config:set fb_service_account="$(cat service-account.json)"


Where `service-account.json` looks like this:

```
{
  "private_key": "YOUR-PRIVATE-KEY",
  "client_email": "YOUR-CLIENT-EMAIL"
}
```

You'll also have to redeploy firebase for that to take into effect

2. Add `environment.personal.ts` next to `environment.staging.ts`

3. Make sure that the `mlDomain` property is set to `http://localhost:4200`

4. Build the project with `yarn run build:personal`

5. In order to make the `ml` command globally available, run `yarn global add /absolute/path/to/cli`. Here it's important that the path is absolute because a relative path like `./` doesn't work.
