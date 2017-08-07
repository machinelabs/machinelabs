## MachineLabs Admin CLI

This is an alpha state CLI for all administration tasks of MachineLabs

### Building the CLI

You can build the CLI from source by running `npm run build`

### Running Commands

You can run commands by invoking `node ./dist/index.js <cmd> [args]`. Notice however that this will just invoke the compiled CLI. If you rather want to compile and run you could run `tsc && node ./dist/index.js <cmd> [args]`. 

Alternatively you may use the shorthand `npm run mla`. The catch with that is that you need to add an extra `--` before the actual command so that the actual command pattern becomes:

`npm run mla -- <cmd> [args]`

An example command would be `npm run mla -- login --help`


### Commands

```
admin-cli/dist/index.js <cmd> [args]

Commands:
  deploy [<options>]  Deploy MachineLabs
  login [<options>]   Login to server
  cut [<options>]     Cut a release

Options:
  --help  Show help                                                    [boolean]
```

### Deploy Command

```
admin-cli/dist/index.js deploy [<options>]

Options:
  --help                        Show help                              [boolean]
  --noServer                    Flag to suppress deployment of server  [boolean]
  --noFb                        Flag to suppress deployment of firebase[boolean]
  --noClient                    Flag to suppress deployment of client  [boolean]
  --cfg.template                Preinitialize googleProjectId, serverName and
                                zone
                                from a template configuration           [string]
  --cfg.target.googleProjectId  GoogleProjectId to be used              [string]
  --cfg.target.serverName       Name of server to be used               [string]
  --cfg.target.zone             Zone of server                          [string]
  --cfg.env                     Environment file for server             [string]
```


### Login Command

```
admin-cli/dist/index.js login [<options>]

Options:
  --help                        Show help                              [boolean]
  --cfg.template                Preinitialize googleProjectId, serverName and
                                zone
                                from a template configuration           [string]
  --cfg.target.googleProjectId  GoogleProjectId to be used              [string]
  --cfg.target.serverName       Name of server to be used               [string]
  --cfg.target.zone             Zone of server                          [string]
  --cfg.env                     Environment file for server             [string]
```