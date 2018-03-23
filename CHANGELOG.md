<a name="0.30.0"></a>
# [0.30.0](https://github.com/machinelabs/machinelabs/compare/0.28.1...0.30.0) (2018-03-23)


### Bug Fixes

* **admin-cli:** add missing import for `of` ([f1a4063](https://github.com/machinelabs/machinelabs/commit/f1a4063))
* **admin-cli:** don't exit with error code 1 if no version is given ([3a1aa5b](https://github.com/machinelabs/machinelabs/commit/3a1aa5b))
* **admin-cli:** ensure changelog is part of each release commit ([383e0c1](https://github.com/machinelabs/machinelabs/commit/383e0c1))
* **admin-cli:** ensure changelog is part of release commit ([2341c15](https://github.com/machinelabs/machinelabs/commit/2341c15))
* **cli:** ignore all dot directories by default ([e609ea6](https://github.com/machinelabs/machinelabs/commit/e609ea6))
* **CompletionProvider:** Support arrays on same level as keyword ([f7f0393](https://github.com/machinelabs/machinelabs/commit/f7f0393))
* **core:** Prevent ignoring source directory ([9d3b94b](https://github.com/machinelabs/machinelabs/commit/9d3b94b)), closes [#746](https://github.com/machinelabs/machinelabs/issues/746)
* **handshake:** Fix typo ([e61c1a9](https://github.com/machinelabs/machinelabs/commit/e61c1a9)), closes [#738](https://github.com/machinelabs/machinelabs/issues/738)
* **LandingPage:** make Getting Started link point to quickstart ([e8384df](https://github.com/machinelabs/machinelabs/commit/e8384df))
* **readme:** fix broken links in README ([d680af6](https://github.com/machinelabs/machinelabs/commit/d680af6))
* **server:** ensure transformer can handle null plan ([dc38023](https://github.com/machinelabs/machinelabs/commit/dc38023))
* **supervisor:** ensure firebase as dependency ([a86cec0](https://github.com/machinelabs/machinelabs/commit/a86cec0))


### Features

* introduce initial explore page ([1394ac4](https://github.com/machinelabs/machinelabs/commit/1394ac4)), closes [#16](https://github.com/machinelabs/machinelabs/issues/16)
* **admin-cli:** introduce new generate-changelog command ([c8e6ca3](https://github.com/machinelabs/machinelabs/commit/c8e6ca3))
* **cli:** Support globbing patterns ([4c44d79](https://github.com/machinelabs/machinelabs/commit/4c44d79)), closes [#751](https://github.com/machinelabs/machinelabs/issues/751)
* **CompletionProvider:** Add completions for the CLI options ([c967684](https://github.com/machinelabs/machinelabs/commit/c967684))
* **LabExecutionService:** introduce method to observe recent executions of lab ([106030b](https://github.com/machinelabs/machinelabs/commit/106030b))



<a name="0.28.1"></a>
## [0.28.1](https://github.com/machinelabs/machinelabs/compare/0.28.0...0.28.1) (2018-02-20)



<a name="0.28.0"></a>
# [0.28.0](https://github.com/machinelabs/machinelabs/compare/0.27.0...0.28.0) (2018-02-14)


### Bug Fixes

* **admin-cli:** ensure shared libs are built before CLI is built ([bf9b453](https://github.com/machinelabs/machinelabs/commit/bf9b453))
* **FilePreview:** Fix image dissapearing in file preview ([b5aae80](https://github.com/machinelabs/machinelabs/commit/b5aae80)), closes [#676](https://github.com/machinelabs/machinelabs/issues/676)
* **firebase/functions:** ensure "Untitled" labs don't show up in recent labs ([99c2df7](https://github.com/machinelabs/machinelabs/commit/99c2df7))



<a name="0.27.0"></a>
# [0.27.0](https://github.com/machinelabs/machinelabs/compare/0.26.1...0.27.0) (2018-02-09)


### Bug Fixes

* **cli:** change tense and improve output message for init command ([6bd468f](https://github.com/machinelabs/machinelabs/commit/6bd468f))
* **cli:** exit process when running ml - fixes [#722](https://github.com/machinelabs/machinelabs/issues/722) ([9c427db](https://github.com/machinelabs/machinelabs/commit/9c427db))


### Features

* **cli:** init command now creates an entry point ([41d4b0a](https://github.com/machinelabs/machinelabs/commit/41d4b0a)), closes [#729](https://github.com/machinelabs/machinelabs/issues/729)
* **cli:** pull command now adds the lab id if non is given ([f9815ed](https://github.com/machinelabs/machinelabs/commit/f9815ed))
* **cli:** push command now adds id to the lab config ([8c1bbe3](https://github.com/machinelabs/machinelabs/commit/8c1bbe3))
* **cli:** show help and exit on invalid cmds ([82e68a2](https://github.com/machinelabs/machinelabs/commit/82e68a2))
* **shared/core:** add ability to update lab configuration on file system ([0a3006e](https://github.com/machinelabs/machinelabs/commit/0a3006e))
* **shared/core:** catch exception when reading lab config from disk ([6d317c8](https://github.com/machinelabs/machinelabs/commit/6d317c8))



<a name="0.26.1"></a>
## [0.26.1](https://github.com/machinelabs/machinelabs/compare/0.26.0...0.26.1) (2018-02-07)


### Bug Fixes

* **cli:** correct wrong paths ([e4ff270](https://github.com/machinelabs/machinelabs/commit/e4ff270))



<a name="0.26.0"></a>
# [0.26.0](https://github.com/machinelabs/machinelabs/compare/0.25.0...0.26.0) (2018-02-07)


### Bug Fixes

* **admin-cli:** ensure 'cut' updates CLI version ([f7e1494](https://github.com/machinelabs/machinelabs/commit/f7e1494))
* **cli:** repair broken init command ([1517f9a](https://github.com/machinelabs/machinelabs/commit/1517f9a))
* **cli/auth:** return error observable in case of auth failure ([4b6692b](https://github.com/machinelabs/machinelabs/commit/4b6692b))
* **server:** ensure resolver are always shared ([2be79f3](https://github.com/machinelabs/machinelabs/commit/2be79f3))
* **shared/core:** add missing type definitions ([6cf548b](https://github.com/machinelabs/machinelabs/commit/6cf548b))
* **test:** ensure we test on strict boolean ([2516e54](https://github.com/machinelabs/machinelabs/commit/2516e54))


### Features

* **@machinelabs/models:** expose maxFileUploads on plan ([37cc4e9](https://github.com/machinelabs/machinelabs/commit/37cc4e9))
* **admin-cli:** add publish-cli command ([086d0aa](https://github.com/machinelabs/machinelabs/commit/086d0aa))
* **cli:** add logout command ([f9844ad](https://github.com/machinelabs/machinelabs/commit/f9844ad))
* **cli:** add pull command ([f7414d8](https://github.com/machinelabs/machinelabs/commit/f7414d8))
* **server:** allow 8 concurrent executions for admins ([62f36a1](https://github.com/machinelabs/machinelabs/commit/62f36a1))
* **server:** depend max upload file on user plan ([c35690c](https://github.com/machinelabs/machinelabs/commit/c35690c))
* **server:** depend max upload size on user plan ([dd83c1b](https://github.com/machinelabs/machinelabs/commit/dd83c1b))
* **server:** handle IO errors more gracefully ([6a3f0ad](https://github.com/machinelabs/machinelabs/commit/6a3f0ad))
* **server:** introduce concept of transformers ([9cef30a](https://github.com/machinelabs/machinelabs/commit/9cef30a))
* **shared/core:** add method to write a directory to the file system using node APIs ([8c6b565](https://github.com/machinelabs/machinelabs/commit/8c6b565))



<a name="0.25.0"></a>
# [0.25.0](https://github.com/machinelabs/machinelabs/compare/0.24.0...0.25.0) (2018-01-29)


### Bug Fixes

* make lab template object immutable ([cd4b3fd](https://github.com/machinelabs/machinelabs/commit/cd4b3fd))
* **cli:** make main.py safe guard actually work ([ae8fd68](https://github.com/machinelabs/machinelabs/commit/ae8fd68))
* **client:** ensure getRecentLabs validates returned labs ([ef42015](https://github.com/machinelabs/machinelabs/commit/ef42015))
* **LabResolver:** add error handling for non existing labs ([e86b6ad](https://github.com/machinelabs/machinelabs/commit/e86b6ad))
* **LabStorageService:** ensure to emit empty list if no recent labs are available ([611190f](https://github.com/machinelabs/machinelabs/commit/611190f))
* **server:** correct imports ([6de4e9f](https://github.com/machinelabs/machinelabs/commit/6de4e9f))
* **server:** ensure executions can't memory attack server ([ae8da4f](https://github.com/machinelabs/machinelabs/commit/ae8da4f)), closes [#687](https://github.com/machinelabs/machinelabs/issues/687)


### Features

* improve ml.yaml read/parsing ergonomics ([156f0c0](https://github.com/machinelabs/machinelabs/commit/156f0c0))
* **@machinelabs/core:** allow globs for excludes in read API ([4fe3aa6](https://github.com/machinelabs/machinelabs/commit/4fe3aa6))
* **cli:** allow specification of excludes in ml.yaml ([523631b](https://github.com/machinelabs/machinelabs/commit/523631b))
* **cli:** amend lab if it exists ([043f0b2](https://github.com/machinelabs/machinelabs/commit/043f0b2)), closes [#677](https://github.com/machinelabs/machinelabs/issues/677)
* **cli:** make it possible to set id in ml.yaml ([38f0fcc](https://github.com/machinelabs/machinelabs/commit/38f0fcc)), closes [#677](https://github.com/machinelabs/machinelabs/issues/677)
* **client:** implement completion provider for ml.yaml ([17f2641](https://github.com/machinelabs/machinelabs/commit/17f2641))
* **EditorSnackbar:** introduce notifyLabNotExisting() method and use it ([70ea77e](https://github.com/machinelabs/machinelabs/commit/70ea77e))
* **firebase:** make docker images readable ([9811a96](https://github.com/machinelabs/machinelabs/commit/9811a96))
* introduce private labs ([a0ef3e6](https://github.com/machinelabs/machinelabs/commit/a0ef3e6)), closes [#665](https://github.com/machinelabs/machinelabs/issues/665) [#673](https://github.com/machinelabs/machinelabs/issues/673)



<a name="0.24.0"></a>
# [0.24.0](https://github.com/machinelabs/machinelabs/compare/0.23.1...0.24.0) (2018-01-15)


### Bug Fixes

* ensure credentials are safe guarded ([04dd338](https://github.com/machinelabs/machinelabs/commit/04dd338))
* **EditorView:** make switching executions work again ([f4c7079](https://github.com/machinelabs/machinelabs/commit/f4c7079))


### Features

* **@machinelabs/core:** add API to read LabDirectory from fs ([bb8e1a4](https://github.com/machinelabs/machinelabs/commit/bb8e1a4))
* **@machinelabs/core:** add APIs to read ml.yaml ([e1439ad](https://github.com/machinelabs/machinelabs/commit/e1439ad))
* **@machinelabs/core:** add ml.yaml default file ([0fc3b6b](https://github.com/machinelabs/machinelabs/commit/0fc3b6b))
* **@machinelabs/core:** complete lab model ([703af78](https://github.com/machinelabs/machinelabs/commit/703af78))
* **@machinelabs/core:** start common lab realtime API ([87ff3b6](https://github.com/machinelabs/machinelabs/commit/87ff3b6))
* **cli:** rudimentary login support ([3948fad](https://github.com/machinelabs/machinelabs/commit/3948fad))
* **CLI:** add import command ([2a06b76](https://github.com/machinelabs/machinelabs/commit/2a06b76))
* **CLI:** add init command ([f6b6699](https://github.com/machinelabs/machinelabs/commit/f6b6699))
* **CLI:** add login command ([bb5eeaf](https://github.com/machinelabs/machinelabs/commit/bb5eeaf))
* **CLI:** stub basic CLI layout ([27ea2aa](https://github.com/machinelabs/machinelabs/commit/27ea2aa))
* add sponsors to landing page ([54017ed](https://github.com/machinelabs/machinelabs/commit/54017ed))
* rename import to save and allow specifying id ([1840163](https://github.com/machinelabs/machinelabs/commit/1840163))



<a name="0.23.1"></a>
## [0.23.1](https://github.com/machinelabs/machinelabs/compare/0.23.0...0.23.1) (2018-01-09)


### Bug Fixes

* **EditorView:** don't overwrite activeFile reference on file change ([1327aaa](https://github.com/machinelabs/machinelabs/commit/1327aaa))
* **EditorView:** ensure MonacoEditor's models are disposed before initializing lab ([22d4269](https://github.com/machinelabs/machinelabs/commit/22d4269)), closes [#667](https://github.com/machinelabs/machinelabs/issues/667)



<a name="0.23.0"></a>
# [0.23.0](https://github.com/machinelabs/machinelabs/compare/0.22.2...0.23.0) (2018-01-05)


### Bug Fixes

* broken spinner ([024287a](https://github.com/machinelabs/machinelabs/commit/024287a))
* digital-format-unit-pipe to not break for bytes equal to zero ([59c9516](https://github.com/machinelabs/machinelabs/commit/59c9516))
* **@machinelabs/supervisor:** adjust paths in tsconfig ([1afab42](https://github.com/machinelabs/machinelabs/commit/1afab42))
* **EditorViewComponent:** toggle file tree sidebar when activated for the first time ([ccff881](https://github.com/machinelabs/machinelabs/commit/ccff881)), closes [#657](https://github.com/machinelabs/machinelabs/issues/657)
* **execution-list:** remove redundant word ([77d5f33](https://github.com/machinelabs/machinelabs/commit/77d5f33))
* **mailchimp:** invert the fail tolerant check ([863b468](https://github.com/machinelabs/machinelabs/commit/863b468))
* **mailchimp:** make it fail tolerant if config not given ([3456f3d](https://github.com/machinelabs/machinelabs/commit/3456f3d))
* **server:** pass liveMetricsService to usageStatisticService ([994943b](https://github.com/machinelabs/machinelabs/commit/994943b))
* **SlimLoadingBar:** bring back loading indicator ([b3cf073](https://github.com/machinelabs/machinelabs/commit/b3cf073))


### Features

* **editor:** replace ace editor with monaco editor ([e7c646d](https://github.com/machinelabs/machinelabs/commit/e7c646d))
* display hardware type for executions ([fd2490d](https://github.com/machinelabs/machinelabs/commit/fd2490d))
* **execution-list:** show duration while executing ([46bdaee](https://github.com/machinelabs/machinelabs/commit/46bdaee))
* **file-outputs:** add button to copy api link to the file ([592402b](https://github.com/machinelabs/machinelabs/commit/592402b))
* **uiux:** make executions on landing page clickable ([4ba318b](https://github.com/machinelabs/machinelabs/commit/4ba318b))



<a name="0.22.2"></a>
## [0.22.2](https://github.com/machinelabs/machinelabs/compare/0.22.0...0.22.2) (2017-12-16)


### Bug Fixes

* set contentType on uploads to empty string ([99ca6ab](https://github.com/machinelabs/machinelabs/commit/99ca6ab))



<a name="0.22.0"></a>
# [0.22.0](https://github.com/machinelabs/machinelabs/compare/0.21.3...0.22.0) (2017-12-15)


### Bug Fixes

* **admin-cli:** ensure takedown check is scoped ([e81885e](https://github.com/machinelabs/machinelabs/commit/e81885e))
* add missing whitespace to make linter happy ([e01161d](https://github.com/machinelabs/machinelabs/commit/e01161d))
* **admin-cli:** make --execution param of takedown respect dry-run ([80a6caf](https://github.com/machinelabs/machinelabs/commit/80a6caf))
* **HasValidExecutionGuard:** ensure hidden executions can't be visited ([43156c5](https://github.com/machinelabs/machinelabs/commit/43156c5)), closes [#630](https://github.com/machinelabs/machinelabs/issues/630)
* **LabExecutionService:** ensure we have no duplicates in execution list updates ([9b70250](https://github.com/machinelabs/machinelabs/commit/9b70250)), closes [/github.com/machinelabs/machinelabs/issues/632#issuecomment-347498709](https://github.com//github.com/machinelabs/machinelabs/issues/632/issues/issuecomment-347498709) [#632](https://github.com/machinelabs/machinelabs/issues/632)
* **server:** tune recycle parameter ([03cb8dc](https://github.com/machinelabs/machinelabs/commit/03cb8dc))


### Features

* **admin-cli:** add clean-deps command ([dd4efb3](https://github.com/machinelabs/machinelabs/commit/dd4efb3))
* **admin-cli:** add new ls-live-executions command ([e37247a](https://github.com/machinelabs/machinelabs/commit/e37247a)), closes [#599](https://github.com/machinelabs/machinelabs/issues/599)
* auto-assign 'beta' plan to new users ([174f030](https://github.com/machinelabs/machinelabs/commit/174f030))
* subscribe new users to mailchimp ([d4a5fcb](https://github.com/machinelabs/machinelabs/commit/d4a5fcb))



<a name="0.21.3"></a>
## [0.21.3](https://github.com/machinelabs/machinelabs/compare/0.21.2...0.21.3) (2017-11-24)


### Bug Fixes

* bring back terms of service website ([778085a](https://github.com/machinelabs/machinelabs/commit/778085a)), closes [#627](https://github.com/machinelabs/machinelabs/issues/627)
* ensure no labs with name "Fork of" are added to recent labs index ([ee50b9e](https://github.com/machinelabs/machinelabs/commit/ee50b9e)), closes [#626](https://github.com/machinelabs/machinelabs/issues/626)
* take plan into account for usage statistic ([9477c74](https://github.com/machinelabs/machinelabs/commit/9477c74))


### Features

* **@machinelabs/core:** add API to generate unique Ids ([a86a513](https://github.com/machinelabs/machinelabs/commit/a86a513))
* **admin-cli:** implement takedown command ([ffc50be](https://github.com/machinelabs/machinelabs/commit/ffc50be)), closes [#366](https://github.com/machinelabs/machinelabs/issues/366)
* **supervisor:** implement lib with super powers ([e9f8a72](https://github.com/machinelabs/machinelabs/commit/e9f8a72)), closes [#366](https://github.com/machinelabs/machinelabs/issues/366)



<a name="0.21.2"></a>
## [0.21.2](https://github.com/machinelabs/machinelabs/compare/0.21.1...0.21.2) (2017-11-22)


### Bug Fixes

* **EditorService:** ensure activeFilePath is set when opening file ([40354f6](https://github.com/machinelabs/machinelabs/commit/40354f6)), closes [/github.com/machinelabs/machinelabs/issues/570#issuecomment-346023151](https://github.com//github.com/machinelabs/machinelabs/issues/570/issues/issuecomment-346023151) [#570](https://github.com/machinelabs/machinelabs/issues/570)
* **functions/post-lab-write:** ensure recent labs index is updated correctly ([341bf47](https://github.com/machinelabs/machinelabs/commit/341bf47)), closes [#612](https://github.com/machinelabs/machinelabs/issues/612)
* keep file tree ui state when running labs ([6ce9f99](https://github.com/machinelabs/machinelabs/commit/6ce9f99)), closes [#591](https://github.com/machinelabs/machinelabs/issues/591)



<a name="0.21.1"></a>
## [0.21.1](https://github.com/machinelabs/machinelabs/compare/0.21.0...0.21.1) (2017-11-21)


### Bug Fixes

* ensure user_executions idx is always updated ([776a38d](https://github.com/machinelabs/machinelabs/commit/776a38d)), closes [#616](https://github.com/machinelabs/machinelabs/issues/616)



<a name="0.21.0"></a>
# [0.21.0](https://github.com/machinelabs/machinelabs/compare/0.20.0...0.21.0) (2017-11-19)


### Bug Fixes

* **EmbeddedEditorView:** use lettable operators ([b520d7d](https://github.com/machinelabs/machinelabs/commit/b520d7d)), closes [#608](https://github.com/machinelabs/machinelabs/issues/608) [#608](https://github.com/machinelabs/machinelabs/issues/608)
* **server:** ensure server shows correct execution state ([984b3a5](https://github.com/machinelabs/machinelabs/commit/984b3a5)), closes [#259](https://github.com/machinelabs/machinelabs/issues/259)
* **toObservableProcess:** handle and propagate spawn errors ([80cdcf3](https://github.com/machinelabs/machinelabs/commit/80cdcf3))
* **Toolbar:** make logo link to start page ([24c4bd5](https://github.com/machinelabs/machinelabs/commit/24c4bd5))


### Code Refactoring

* **ExecutionRejectionReason:** use string enum ([9db5c4e](https://github.com/machinelabs/machinelabs/commit/9db5c4e))


### Features

* **client:** show message when GPU is not permitted ([c591359](https://github.com/machinelabs/machinelabs/commit/c591359))
* **firebase/functions:** assign server based on ml.yaml setting ([1237dfc](https://github.com/machinelabs/machinelabs/commit/1237dfc))
* **LandingPage:** show launch editor button when logged-in ([f882ffc](https://github.com/machinelabs/machinelabs/commit/f882ffc))
* **server:** allow system user to stop any execution ([51807fa](https://github.com/machinelabs/machinelabs/commit/51807fa))
* change container mount path ([75e6f9a](https://github.com/machinelabs/machinelabs/commit/75e6f9a)), closes [#602](https://github.com/machinelabs/machinelabs/issues/602)
* max cap GPU hours ([388082c](https://github.com/machinelabs/machinelabs/commit/388082c))
* **server:** conditional pull docker images on startup ([07a1fc5](https://github.com/machinelabs/machinelabs/commit/07a1fc5)), closes [#607](https://github.com/machinelabs/machinelabs/issues/607)
* **server:** decide which docker binary to use at startup ([18f0685](https://github.com/machinelabs/machinelabs/commit/18f0685))
* **server:** provide failed_at/stopped_at on execution ([d61ba99](https://github.com/machinelabs/machinelabs/commit/d61ba99))
* **server:** reject GPU usage for non admins and non backers ([fb96a99](https://github.com/machinelabs/machinelabs/commit/fb96a99))
* **server:** report wrong hardwareType in ml.yaml to user ([d7464dd](https://github.com/machinelabs/machinelabs/commit/d7464dd))
* **Toolbar:** teach toolbar login button type ([9e1733d](https://github.com/machinelabs/machinelabs/commit/9e1733d))


### BREAKING CHANGES

* **ExecutionRejectionReason:** (in fact, it is) but in reality
it shouldn't cause big trouble.

While it is true that all existing rejected
executions will can't be matched anymore,
those messages are throw away one-time information
only visible to the one who started the exectution
and only in the very moment of the rejection.

And even if for some reason client and server
talk different things for a brief moment in time
the worst thing that could happen is the client
showing a generic rejection message instead
of a specialized one.

The benefits outweigh the risks.



<a name="0.20.0"></a>
# [0.20.0](https://github.com/machinelabs/machinelabs/compare/0.19.0...0.20.0) (2017-11-07)


### Features

* **client:** implement explore feature ([137c268](https://github.com/machinelabs/machinelabs/commit/137c268))



<a name="0.19.0"></a>
# [0.19.0](https://github.com/machinelabs/machinelabs/compare/0.18.0...0.19.0) (2017-11-06)


### Bug Fixes

* **client:** ensure invocation lab has no clientData persisted ([21b9895](https://github.com/machinelabs/machinelabs/commit/21b9895))
* **client:** ensure LabDirectory is parsed correctly ([7e55266](https://github.com/machinelabs/machinelabs/commit/7e55266)), closes [#578](https://github.com/machinelabs/machinelabs/issues/578)
* **client:** ensure only one file is selected ([e3c6e9e](https://github.com/machinelabs/machinelabs/commit/e3c6e9e)), closes [#570](https://github.com/machinelabs/machinelabs/issues/570)
* **client:** migrate leftover Rx operators ([6fd1f24](https://github.com/machinelabs/machinelabs/commit/6fd1f24))
* **client:** remove unintended scrollbars in execution list ([dc55cf8](https://github.com/machinelabs/machinelabs/commit/dc55cf8))
* **client:** use stringifyDirectory API ([e38b84d](https://github.com/machinelabs/machinelabs/commit/e38b84d))
* **server:** use quotes for input names and URLs ([e2575cc](https://github.com/machinelabs/machinelabs/commit/e2575cc)), closes [#571](https://github.com/machinelabs/machinelabs/issues/571)
* ensure shared libs and server build with local tsc ([d529a40](https://github.com/machinelabs/machinelabs/commit/d529a40))
* fix prod CI builds by nailing yarn version to 1.0.0 ([b92af24](https://github.com/machinelabs/machinelabs/commit/b92af24))
* make sure lab.directory is always an Array ([aa87708](https://github.com/machinelabs/machinelabs/commit/aa87708)), closes [#579](https://github.com/machinelabs/machinelabs/issues/579)


### Features

* **@machinelabs/core:** create parseLabDirectory method ([6d7f55f](https://github.com/machinelabs/machinelabs/commit/6d7f55f))
* allow files uploads to be 50mb each max ([8749c5b](https://github.com/machinelabs/machinelabs/commit/8749c5b))
* **server:** implement mount feature ([e90c7a8](https://github.com/machinelabs/machinelabs/commit/e90c7a8)), closes [#564](https://github.com/machinelabs/machinelabs/issues/564) [#488](https://github.com/machinelabs/machinelabs/issues/488)



<a name="0.18.0"></a>
# [0.18.0](https://github.com/machinelabs/machinelabs/compare/0.17.1...0.18.0) (2017-10-16)


### Bug Fixes

* **@machinelabs/core:** fix linting issues ([10e34db](https://github.com/machinelabs/machinelabs/commit/10e34db))
* remove fdescribe to not skip tests ([d887b0f](https://github.com/machinelabs/machinelabs/commit/d887b0f))
* trailing whitespace ([cbff603](https://github.com/machinelabs/machinelabs/commit/cbff603))
* **client:** disallow conflicting names ([452d7a1](https://github.com/machinelabs/machinelabs/commit/452d7a1))
* **client:** make ml.yaml mandatory ([27cb99b](https://github.com/machinelabs/machinelabs/commit/27cb99b))
* **client:** use correct captions for add/edit file/folder dialog ([fb7082c](https://github.com/machinelabs/machinelabs/commit/fb7082c))
* **LabStorageService:** add safe guard ([53727df](https://github.com/machinelabs/machinelabs/commit/53727df))
* **models:** use Directory type in instanceOfDirectory helper function ([4566e62](https://github.com/machinelabs/machinelabs/commit/4566e62))
* **tests:** make e2e tests work again ([b991ed0](https://github.com/machinelabs/machinelabs/commit/b991ed0))


### Features

* **@machinelabs/core:** support for writing nested directories ([45ed7cc](https://github.com/machinelabs/machinelabs/commit/45ed7cc)), closes [#502](https://github.com/machinelabs/machinelabs/issues/502)
* **@machinelabs/models:** introduce [@machinelabs](https://github.com/machinelabs)/models package ([56d4e75](https://github.com/machinelabs/machinelabs/commit/56d4e75)), closes [#513](https://github.com/machinelabs/machinelabs/issues/513)
* **admin-cli:** adds export-users command ([d4f85ed](https://github.com/machinelabs/machinelabs/commit/d4f85ed))
* **admin-cli:** include REST API in cut command ([eaec317](https://github.com/machinelabs/machinelabs/commit/eaec317))
* **admin-cli:** integrate REST API in deploy command ([201fcde](https://github.com/machinelabs/machinelabs/commit/201fcde))
* **EditorService:** introduce methods to delete and update files ([18595fc](https://github.com/machinelabs/machinelabs/commit/18595fc))
* **EditorService:** make EditorService folder and path aware ([22c70e1](https://github.com/machinelabs/machinelabs/commit/22c70e1))
* **file-tree:** add stylings and improve ergonomics ([1a1055d](https://github.com/machinelabs/machinelabs/commit/1a1055d))
* **FileList:** introduce FileListComponent and allow nested directories ([d7fdb06](https://github.com/machinelabs/machinelabs/commit/d7fdb06))
* **FileTree:** teach file tee input for root directory ([c4101e2](https://github.com/machinelabs/machinelabs/commit/c4101e2))
* **NameDialog:** introduce validator to ensure no duplicate files or folders are created ([9e00970](https://github.com/machinelabs/machinelabs/commit/9e00970))
* introduce editorServiceStub and reexport stubs from /stubs ([75c1901](https://github.com/machinelabs/machinelabs/commit/75c1901))
* introduce file tree helper utilities ([72a24d2](https://github.com/machinelabs/machinelabs/commit/72a24d2))
* **rest-api:** handle errors ([13715fb](https://github.com/machinelabs/machinelabs/commit/13715fb))
* **rest-api:** initial design ([d1507d8](https://github.com/machinelabs/machinelabs/commit/d1507d8))
* **rest-api:** mock bucket for local development ([9f96f70](https://github.com/machinelabs/machinelabs/commit/9f96f70))
* **server:** add support for nested directories ([30145f8](https://github.com/machinelabs/machinelabs/commit/30145f8))



<a name="0.17.1"></a>
## [0.17.1](https://github.com/machinelabs/machinelabs/compare/0.17.0...0.17.1) (2017-10-12)


### Bug Fixes

* ensure md drawer calculates container margins properly ([21aeff8](https://github.com/machinelabs/machinelabs/commit/21aeff8)), closes [#525](https://github.com/machinelabs/machinelabs/issues/525)



<a name="0.17.0"></a>
# [0.17.0](https://github.com/machinelabs/machinelabs/compare/0.16.0...0.17.0) (2017-10-11)


### Features

* add link to docs ([c97dea0](https://github.com/machinelabs/machinelabs/commit/c97dea0)), closes [#551](https://github.com/machinelabs/machinelabs/issues/551)



<a name="0.16.0"></a>
# [0.16.0](https://github.com/machinelabs/machinelabs/compare/0.15.1...0.16.0) (2017-10-09)


### Bug Fixes

* enable all tests ([083a83b](https://github.com/machinelabs/machinelabs/commit/083a83b))
* jumping between files when saving ([f6788e4](https://github.com/machinelabs/machinelabs/commit/f6788e4))
* make `tab` query param work in emebedded editor view ([665093c](https://github.com/machinelabs/machinelabs/commit/665093c))


### Features

* add dialog to preview output files (images only) ([b0b4fb3](https://github.com/machinelabs/machinelabs/commit/b0b4fb3))
* add removeQueryParams to LocationHelper ([6bf9ac3](https://github.com/machinelabs/machinelabs/commit/6bf9ac3))
* make has-credits-left validation rule aware of plans ([2293761](https://github.com/machinelabs/machinelabs/commit/2293761))
* **EmbeddedEditorView:** make outputs tab available for embedded view as well ([2c84617](https://github.com/machinelabs/machinelabs/commit/2c84617)), closes [#528](https://github.com/machinelabs/machinelabs/issues/528)



<a name="0.15.1"></a>
## [0.15.1](https://github.com/machinelabs/machinelabs/compare/0.14.1...0.15.1) (2017-09-27)


### Bug Fixes

* **@machinelabs/core:** fix lint invocation ([a061f67](https://github.com/machinelabs/machinelabs/commit/a061f67))
* **@machinelabs/core:** fix linting errors ([8b708c6](https://github.com/machinelabs/machinelabs/commit/8b708c6))
* **@machinelabs/metrics:** fix linter invocation ([80c7846](https://github.com/machinelabs/machinelabs/commit/80c7846))
* **@machinelabs/metrics:** fix linting errors ([8af9228](https://github.com/machinelabs/machinelabs/commit/8af9228))
* jumping between files when saving ([15da038](https://github.com/machinelabs/machinelabs/commit/15da038))
* make config checks more sound ([0d11188](https://github.com/machinelabs/machinelabs/commit/0d11188))
* **firebase:** fix memory consumption issue in cloud function ([02c897b](https://github.com/machinelabs/machinelabs/commit/02c897b)), closes [#531](https://github.com/machinelabs/machinelabs/issues/531)
* **server:** fix call to linter ([4fef839](https://github.com/machinelabs/machinelabs/commit/4fef839))


### Features

* **server:** allow inputs to be configured in ml.yamls ([df90159](https://github.com/machinelabs/machinelabs/commit/df90159)), closes [#490](https://github.com/machinelabs/machinelabs/issues/490)
* allow args in ml.yaml ([4e32853](https://github.com/machinelabs/machinelabs/commit/4e32853))
* expose version numbers for client and server ([d347654](https://github.com/machinelabs/machinelabs/commit/d347654))



<a name="0.14.1"></a>
## [0.14.1](https://github.com/machinelabs/machinelabs/compare/0.14.0...0.14.1) (2017-09-16)


### Bug Fixes

* **rleService:** share control messages independently ([8912ba2](https://github.com/machinelabs/machinelabs/commit/8912ba2)), closes [#505](https://github.com/machinelabs/machinelabs/issues/505)


### Features

* **ObservableDbRef:** add equalTo support ([1c45d60](https://github.com/machinelabs/machinelabs/commit/1c45d60))


### Performance Improvements

* create index for MessageKind ([28f5607](https://github.com/machinelabs/machinelabs/commit/28f5607))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/machinelabs/machinelabs/compare/0.13.0...0.14.0) (2017-09-13)


### Bug Fixes

* **server:** supress error messages when no output exists ([b880508](https://github.com/machinelabs/machinelabs/commit/b880508)), closes [#479](https://github.com/machinelabs/machinelabs/issues/479)
* defer consumption of messages until xterm becomes active ([5baefdb](https://github.com/machinelabs/machinelabs/commit/5baefdb))
* ensure EditorService always selects correct tab based on query param ([a5760e6](https://github.com/machinelabs/machinelabs/commit/a5760e6)), closes [#492](https://github.com/machinelabs/machinelabs/issues/492)
* ensure main.py file can't be renamed (and therefore removed) ([0be51f1](https://github.com/machinelabs/machinelabs/commit/0be51f1)), closes [#489](https://github.com/machinelabs/machinelabs/issues/489)
* ensure OutputFilesService.hasOutputFiles() emits false synchronously ([323c517](https://github.com/machinelabs/machinelabs/commit/323c517))
* ensure snack messages work when output isn't consumed ([7e48122](https://github.com/machinelabs/machinelabs/commit/7e48122)), closes [#493](https://github.com/machinelabs/machinelabs/issues/493)
* make CI work again ([5d059a6](https://github.com/machinelabs/machinelabs/commit/5d059a6))
* only trigger cloud function for freshly written files ([4920a32](https://github.com/machinelabs/machinelabs/commit/4920a32))
* preserve query parameter when switching tabs ([fed2e75](https://github.com/machinelabs/machinelabs/commit/fed2e75)), closes [#494](https://github.com/machinelabs/machinelabs/issues/494)


### Features

* **client:** add OutputFilesService ([8af6181](https://github.com/machinelabs/machinelabs/commit/8af6181))
* **client:** reword rejection dialog ([6cb60df](https://github.com/machinelabs/machinelabs/commit/6cb60df))
* **outputs:** create cloud function to write file meta data in db ([5406c79](https://github.com/machinelabs/machinelabs/commit/5406c79))
* **server:** add file upload utils ([ce26f7b](https://github.com/machinelabs/machinelabs/commit/ce26f7b))
* **server:** add meta data to storage object ([a9709b1](https://github.com/machinelabs/machinelabs/commit/a9709b1))
* **server:** auto create ./outputs directory ([79aa572](https://github.com/machinelabs/machinelabs/commit/79aa572))
* **server:** upload user generated files ([83e9bf2](https://github.com/machinelabs/machinelabs/commit/83e9bf2)), closes [#387](https://github.com/machinelabs/machinelabs/issues/387)
* **server/outputs:** add logs and display failure to the user ([b8ab7e6](https://github.com/machinelabs/machinelabs/commit/b8ab7e6))
* add pipe to output digital format units based on byte value ([42c734d](https://github.com/machinelabs/machinelabs/commit/42c734d))
* add storage security rules ([ac03758](https://github.com/machinelabs/machinelabs/commit/ac03758))
* introduce editor tab for file outputs ([da60e63](https://github.com/machinelabs/machinelabs/commit/da60e63))
* introduce nested menu for lab templates ([8342349](https://github.com/machinelabs/machinelabs/commit/8342349))
* **server/outputs:** implement quotas ([fa1a475](https://github.com/machinelabs/machinelabs/commit/fa1a475)), closes [#387](https://github.com/machinelabs/machinelabs/issues/387)
* **storage.rules:** prevent users from writing any files directly ([2dbfb52](https://github.com/machinelabs/machinelabs/commit/2dbfb52))



<a name="0.13.0"></a>
# [0.13.0](https://github.com/machinelabs/machinelabs/compare/0.12.3...0.13.0) (2017-09-05)


### Bug Fixes

* **firebase:** add stephanskirchen to index ([afa4334](https://github.com/machinelabs/machinelabs/commit/afa4334))
* fix saving labs that aren't actual forks ([168c8a2](https://github.com/machinelabs/machinelabs/commit/168c8a2)), closes [#468](https://github.com/machinelabs/machinelabs/issues/468)
* instantly show rejection dialog for anonymous users ([7123f1c](https://github.com/machinelabs/machinelabs/commit/7123f1c)), closes [#444](https://github.com/machinelabs/machinelabs/issues/444)


### Code Refactoring

* **admin-cli:** change structure of configs ([17b6afe](https://github.com/machinelabs/machinelabs/commit/17b6afe))


### Features

* make active tab configurable via URL query parameter ([7a7ae5d](https://github.com/machinelabs/machinelabs/commit/7a7ae5d))


### BREAKING CHANGES

* **admin-cli:** The new structure (for both checked-in and personal confs)
goes as follows:

```
staging2: {
    server: {
      name: 'ahlem',
      zone: 'europe-west1-c',
      env: 'staging2'
    },
    client: {
      env: 'staging'
    },
    firebase: {
      databaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
      privateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
      clientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
    },
    googleProjectId: 'machinelabs-a73cd'
  }
```



<a name="0.12.3"></a>
## [0.12.3](https://github.com/machinelabs/machinelabs/compare/0.12.1...0.12.3) (2017-08-31)


### Bug Fixes

* use correct env file for server ([a055ec9](https://github.com/machinelabs/machinelabs/commit/a055ec9))



<a name="0.12.1"></a>
## [0.12.1](https://github.com/machinelabs/machinelabs/compare/0.12.0...0.12.1) (2017-08-31)



<a name="0.12.0"></a>
# [0.12.0](https://github.com/machinelabs/machinelabs/compare/0.10.0...0.12.0) (2017-08-31)


### Bug Fixes

* **docker-runner:** run `exec` command in terminal mode ([c70b531](https://github.com/machinelabs/machinelabs/commit/c70b531))
* fix broken execution list UI ([9d95c93](https://github.com/machinelabs/machinelabs/commit/9d95c93))
* make e2e tests work again ([7830d3d](https://github.com/machinelabs/machinelabs/commit/7830d3d))
* show notification when execution has failed ([e7e4572](https://github.com/machinelabs/machinelabs/commit/e7e4572)), closes [#455](https://github.com/machinelabs/machinelabs/issues/455)
* show notification when login failed ([71b2661](https://github.com/machinelabs/machinelabs/commit/71b2661)), closes [#445](https://github.com/machinelabs/machinelabs/issues/445)


### Features

* introduce xterm component ([ee82bba](https://github.com/machinelabs/machinelabs/commit/ee82bba))
* use new xterm component ([f098319](https://github.com/machinelabs/machinelabs/commit/f098319)), closes [#438](https://github.com/machinelabs/machinelabs/issues/438)
* **@machinelabs/core:** add reactive-process tools ([f68b372](https://github.com/machinelabs/machinelabs/commit/f68b372))
* **@machinelabs/core:** add util to remove new lines ([4d2694c](https://github.com/machinelabs/machinelabs/commit/4d2694c))
* **admin-cli:** make deployment faster and more convenient ([44d4bca](https://github.com/machinelabs/machinelabs/commit/44d4bca))
* **server:** add reactive process tools ([ffced12](https://github.com/machinelabs/machinelabs/commit/ffced12))
* **server:** add rx utility mute function ([8a30db8](https://github.com/machinelabs/machinelabs/commit/8a30db8))
* **server:** refactor docker usage ([748b01e](https://github.com/machinelabs/machinelabs/commit/748b01e)), closes [#387](https://github.com/machinelabs/machinelabs/issues/387)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/machinelabs/machinelabs/compare/0.9.0...0.10.0) (2017-08-24)


### Features

* use log4js for logging ([1bdc46a](https://github.com/machinelabs/machinelabs/commit/1bdc46a)), closes [#331](https://github.com/machinelabs/machinelabs/issues/331)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/machinelabs/machinelabs/compare/0.8.0...0.9.0) (2017-08-23)


### Bug Fixes

* ensure lab resolver redirects to editor if lab doesn't exist anymore ([78f6c3d](https://github.com/machinelabs/machinelabs/commit/78f6c3d))
* **EditorService:** treat optional options as optional ([6c66291](https://github.com/machinelabs/machinelabs/commit/6c66291)), closes [#428](https://github.com/machinelabs/machinelabs/issues/428)
* fix wrong property lookup in migration script ([aec19ec](https://github.com/machinelabs/machinelabs/commit/aec19ec))
* make app compilable again by adding missing hidden properties to lab objects ([53b84df](https://github.com/machinelabs/machinelabs/commit/53b84df))


### Features

* add fork_of property to database rules ([9a40f78](https://github.com/machinelabs/machinelabs/commit/9a40f78))
* add fork_of property to Lab model and align CRUD methods ([ad44183](https://github.com/machinelabs/machinelabs/commit/ad44183)), closes [#151](https://github.com/machinelabs/machinelabs/issues/151)
* enable deletion of labs via advanced view in edit lab dialog ([c8b9ec1](https://github.com/machinelabs/machinelabs/commit/c8b9ec1))
* introduce dropdown to choose from lab template when creating new labs ([3e1f912](https://github.com/machinelabs/machinelabs/commit/3e1f912))
* introduce MNIST lab template and make it the default for now ([c3c61e3](https://github.com/machinelabs/machinelabs/commit/c3c61e3))
* introduce user_visible_labs node and hidden property in Lab type ([46a6820](https://github.com/machinelabs/machinelabs/commit/46a6820))
* **admin-cli:** tune how personal configs work ([9468c8b](https://github.com/machinelabs/machinelabs/commit/9468c8b))
* **client:** tune MessageStreamOptimizer params ([adf2883](https://github.com/machinelabs/machinelabs/commit/adf2883))
* **EditorService:** introduce deleteLab method ([1b856bc](https://github.com/machinelabs/machinelabs/commit/1b856bc))
* **EditorSnackbar:** add notifyLabDeleted method ([b3d4179](https://github.com/machinelabs/machinelabs/commit/b3d4179))
* **EditorToolbar:** show fork information of lab ([40cf63f](https://github.com/machinelabs/machinelabs/commit/40cf63f))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/machinelabs/machinelabs/compare/0.7.0...0.8.0) (2017-08-22)


### Bug Fixes

* ensure HasRunningExecutionGuard dialog only shows up for owners ([0102a22](https://github.com/machinelabs/machinelabs/commit/0102a22)), closes [#394](https://github.com/machinelabs/machinelabs/issues/394)
* fix production build by moving autotrack to vendor scripts ([e236ab5](https://github.com/machinelabs/machinelabs/commit/e236ab5))
* only output newlines when newlines are sent ([04790fd](https://github.com/machinelabs/machinelabs/commit/04790fd)), closes [#396](https://github.com/machinelabs/machinelabs/issues/396)
* reset active execution id when rejected ([7043997](https://github.com/machinelabs/machinelabs/commit/7043997)), closes [#389](https://github.com/machinelabs/machinelabs/issues/389) [#400](https://github.com/machinelabs/machinelabs/issues/400)
* **server:** don't adjust index for last message ([fda3bfc](https://github.com/machinelabs/machinelabs/commit/fda3bfc))
* **server:** ensure to kill execution on unexpected errors ([ef4a6a4](https://github.com/machinelabs/machinelabs/commit/ef4a6a4))
* **server:** handle error during recycle bulk update ([40f672d](https://github.com/machinelabs/machinelabs/commit/40f672d))
* **server:** handle getMessages error in recycle phase ([0aed1f0](https://github.com/machinelabs/machinelabs/commit/0aed1f0))
* **server:** implement rate limit for messages ([79f7822](https://github.com/machinelabs/machinelabs/commit/79f7822)), closes [#418](https://github.com/machinelabs/machinelabs/issues/418)
* **userService:** rename API ([0f9052d](https://github.com/machinelabs/machinelabs/commit/0f9052d))


### Features

* **AceEditor:** introduce wordWrap property and enable it in console output ([b6d3a4c](https://github.com/machinelabs/machinelabs/commit/b6d3a4c))
* **admin-cli:** allow personal config template ([eafc536](https://github.com/machinelabs/machinelabs/commit/eafc536))
* **admin-cli:** introduce migrate command ([1f83d5b](https://github.com/machinelabs/machinelabs/commit/1f83d5b)), closes [#380](https://github.com/machinelabs/machinelabs/issues/380)
* **admin-cli:** make command arguments available to migrate command ([8d4481a](https://github.com/machinelabs/machinelabs/commit/8d4481a))
* **EditorService:** add ListenAndNotifyOptions ([85a1e53](https://github.com/machinelabs/machinelabs/commit/85a1e53))
* allow server to be disabled ([13b431d](https://github.com/machinelabs/machinelabs/commit/13b431d)), closes [#388](https://github.com/machinelabs/machinelabs/issues/388)
* **EditorSnackbar:** introduce notify methods for pause mode ([dd6aaae](https://github.com/machinelabs/machinelabs/commit/dd6aaae))
* add ga integration and ensure url changes are being tracked ([185636b](https://github.com/machinelabs/machinelabs/commit/185636b)), closes [#397](https://github.com/machinelabs/machinelabs/issues/397)
* enable users to scroll to bottom of console output ([ebb0623](https://github.com/machinelabs/machinelabs/commit/ebb0623)), closes [#409](https://github.com/machinelabs/machinelabs/issues/409)
* implement pause mode ([985efba](https://github.com/machinelabs/machinelabs/commit/985efba)), closes [#392](https://github.com/machinelabs/machinelabs/issues/392)
* reduce message cap from 100k to 10k ([acd77b0](https://github.com/machinelabs/machinelabs/commit/acd77b0)), closes [#421](https://github.com/machinelabs/machinelabs/issues/421)
* **server:** add critical logs ([abbd3eb](https://github.com/machinelabs/machinelabs/commit/abbd3eb))
* **server:** add more logs ([3d280af](https://github.com/machinelabs/machinelabs/commit/3d280af))
* **server:** continuously recycle space for infinite messages ([e44e99c](https://github.com/machinelabs/machinelabs/commit/e44e99c)), closes [#395](https://github.com/machinelabs/machinelabs/issues/395)
* **server:** retry recycling after failed attempts ([32fac9a](https://github.com/machinelabs/machinelabs/commit/32fac9a))
* **server:** several fixes & improvements for msg recycling ([cef066f](https://github.com/machinelabs/machinelabs/commit/cef066f))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/machinelabs/machinelabs/compare/0.6.1...0.7.0) (2017-08-15)


### Bug Fixes

* **admin-cli:** allow usage of two no-flags ([72f04ae](https://github.com/machinelabs/machinelabs/commit/72f04ae))
* **admin-cli:** show helponly if no cmd given ([3a0144e](https://github.com/machinelabs/machinelabs/commit/3a0144e))
* **admin-cli/cut:** ensure correct yarn.lock ([ef217dc](https://github.com/machinelabs/machinelabs/commit/ef217dc))
* **client:** ensure stop invocations set rate proof ([72f63c6](https://github.com/machinelabs/machinelabs/commit/72f63c6))
* **server:** make sure we check for anonymous users first ([078a02f](https://github.com/machinelabs/machinelabs/commit/078a02f))


### Features

* **@machinelabs/core:** add DateUtil ([66bd21b](https://github.com/machinelabs/machinelabs/commit/66bd21b))
* **@machinelabs/core:** create DbRefBuilder ([16875ed](https://github.com/machinelabs/machinelabs/commit/16875ed))
* **@machinelabs/core:** create shared models ([4483df2](https://github.com/machinelabs/machinelabs/commit/4483df2))
* **@machinelabs/metrics:** port to new lib ([2cbd043](https://github.com/machinelabs/machinelabs/commit/2cbd043))
* **admin-cli:** add dry-run flag to onboard cmd ([a802a44](https://github.com/machinelabs/machinelabs/commit/a802a44))
* **admin-cli:** add onboard command ([5cc157f](https://github.com/machinelabs/machinelabs/commit/5cc157f))
* **admin-cli:** allow usage of firebase ([82c1e99](https://github.com/machinelabs/machinelabs/commit/82c1e99))
* **client:** fine tune rejection messages ([7bb207a](https://github.com/machinelabs/machinelabs/commit/7bb207a)), closes [#391](https://github.com/machinelabs/machinelabs/issues/391)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/machinelabs/machinelabs/compare/0.6.0...0.6.1) (2017-08-09)


### Bug Fixes

* fix bug that admin cli can't be built because of syntax error ([f212e6c](https://github.com/machinelabs/machinelabs/commit/f212e6c))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/machinelabs/machinelabs/compare/0.5.0...0.6.0) (2017-08-09)


### Bug Fixes

* **admin-cli:** adjust setRootDir for new directory ([eec8e29](https://github.com/machinelabs/machinelabs/commit/eec8e29))
* correct some typescript nits ([25fc1b9](https://github.com/machinelabs/machinelabs/commit/25fc1b9))
* **admin-cli:** correct deploy command ([6e9c69c](https://github.com/machinelabs/machinelabs/commit/6e9c69c))
* **EditorView:** open execution list when lab has executions ([6c32ffc](https://github.com/machinelabs/machinelabs/commit/6c32ffc)), closes [#365](https://github.com/machinelabs/machinelabs/issues/365)


### Features

* **@machinelabs/core:** create shared lib ([2b04ba6](https://github.com/machinelabs/machinelabs/commit/2b04ba6))
* **admin-cli:** add mla shorthand script ([b704ee1](https://github.com/machinelabs/machinelabs/commit/b704ee1))
* **admin-cli:** show help if no command given ([527631c](https://github.com/machinelabs/machinelabs/commit/527631c))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/machinelabs/machinelabs/compare/0.4.0...0.5.0) (2017-08-07)


### Features

* **EditorService:** ensure saved lab is emitted ([7125b04](https://github.com/machinelabs/machinelabs/commit/7125b04))
* **EditorService:** introduce forkLab() method ([56f72fa](https://github.com/machinelabs/machinelabs/commit/56f72fa))
* introduce fork and run action ([ed96569](https://github.com/machinelabs/machinelabs/commit/ed96569))


### Performance Improvements

* **client:** make UndoManager configureable ([a8efb6e](https://github.com/machinelabs/machinelabs/commit/a8efb6e)), closes [#307](https://github.com/machinelabs/machinelabs/issues/307)
* **editorService:** continously empty output buffer ([2a7d7e6](https://github.com/machinelabs/machinelabs/commit/2a7d7e6)), closes [#307](https://github.com/machinelabs/machinelabs/issues/307)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/machinelabs/machinelabs/compare/0.3.1...0.4.0) (2017-08-04)


### Bug Fixes

* set active execution id on artificial execution ([73fa694](https://github.com/machinelabs/machinelabs/commit/73fa694))
* **client:** remove rejected executions from local executions ([aae0c19](https://github.com/machinelabs/machinelabs/commit/aae0c19))
* **database:** fix major security issue ([6a579b0](https://github.com/machinelabs/machinelabs/commit/6a579b0)), closes [#348](https://github.com/machinelabs/machinelabs/issues/348)
* **FileTreeComponent:** set overflow to auto ([6d18a99](https://github.com/machinelabs/machinelabs/commit/6d18a99))
* **rleService:** make run API error after timeout ([3e09c97](https://github.com/machinelabs/machinelabs/commit/3e09c97))
* **rleService:** make sure timeout does not keep stream alive ([cf178f1](https://github.com/machinelabs/machinelabs/commit/cf178f1))
* **server/messagingService:** make sure msg index is correct ([c56bbb4](https://github.com/machinelabs/machinelabs/commit/c56bbb4)), closes [#362](https://github.com/machinelabs/machinelabs/issues/362)


### Features

* introduce EditorTestingModule ([82dc51b](https://github.com/machinelabs/machinelabs/commit/82dc51b)), closes [#319](https://github.com/machinelabs/machinelabs/issues/319)
* introduce rate limit for invocations ([f0b8125](https://github.com/machinelabs/machinelabs/commit/f0b8125)), closes [#340](https://github.com/machinelabs/machinelabs/issues/340)
* make executions instantly appear in sidebar ([c57cb64](https://github.com/machinelabs/machinelabs/commit/c57cb64)), closes [#316](https://github.com/machinelabs/machinelabs/issues/316)
* **EditorService:** introduce executeLab() method ([0adc524](https://github.com/machinelabs/machinelabs/commit/0adc524))
* **EditorService:** introduce new saveLab() method and use it in editor ([a594a7f](https://github.com/machinelabs/machinelabs/commit/a594a7f))
* **LocationHelper:** introduce method to retrieve root url segment ([6f2dd60](https://github.com/machinelabs/machinelabs/commit/6f2dd60))
* **server:** give everyone 72 free hours per month ([2429ece](https://github.com/machinelabs/machinelabs/commit/2429ece))
* **server/messagingService:** limit number of written messages ([1b95ab1](https://github.com/machinelabs/machinelabs/commit/1b95ab1)), closes [#351](https://github.com/machinelabs/machinelabs/issues/351)


### Performance Improvements

* **database:** add index on invocations ([7dffaf1](https://github.com/machinelabs/machinelabs/commit/7dffaf1))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/machinelabs/machinelabs/compare/0.3.0...0.3.1) (2017-08-02)


### Bug Fixes

* fix broken tweet intent url ([5167a6e](https://github.com/machinelabs/machinelabs/commit/5167a6e))
* **admin-cli:** no need to use cfg for some flags ([f333bad](https://github.com/machinelabs/machinelabs/commit/f333bad))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/machinelabs/machinelabs/compare/0.2.0...0.3.0) (2017-08-02)


### Bug Fixes

* **admin-cli:** adjust generated commit message ([b678e1e](https://github.com/machinelabs/machinelabs/commit/b678e1e))
* **admin-cli:** correct ´target´ checks ([a3ee5af](https://github.com/machinelabs/machinelabs/commit/a3ee5af))
* **admin-cli:** correct target checks ([7c12db4](https://github.com/machinelabs/machinelabs/commit/7c12db4))
* **admin-cli:** don't hardcode googleProjectId in deploy cmd ([3ed6f72](https://github.com/machinelabs/machinelabs/commit/3ed6f72))
* **admin-cli:** make sure to check for all props of target ([06b4723](https://github.com/machinelabs/machinelabs/commit/06b4723))
* **admin-cli/cut:** adjust generate messages ([6455850](https://github.com/machinelabs/machinelabs/commit/6455850))
* **admin-cli/cut:** append build in dev version tags ([4aeb6a5](https://github.com/machinelabs/machinelabs/commit/4aeb6a5))
* **client:** make sure to reinit editorService ([af4b629](https://github.com/machinelabs/machinelabs/commit/af4b629))


### Features

* **admin-cli:** upload tags after deployment ([b6a3862](https://github.com/machinelabs/machinelabs/commit/b6a3862))
* **admin-cli/deploy:** ensure clean working dir ([3735c50](https://github.com/machinelabs/machinelabs/commit/3735c50))
* **LocationHelper:** introduce prepareExternalUrl() method ([be75b4a](https://github.com/machinelabs/machinelabs/commit/be75b4a))
* introduce embed dialog ([f0dbe4a](https://github.com/machinelabs/machinelabs/commit/f0dbe4a)), closes [#328](https://github.com/machinelabs/machinelabs/issues/328)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/machinelabs/machinelabs/compare/497c85a...0.2.0) (2017-08-01)


### Bug Fixes

* access correct firebase node for `/labs` ([830f54a](https://github.com/machinelabs/machinelabs/commit/830f54a)), closes [#139](https://github.com/machinelabs/machinelabs/issues/139)
* bring back authentication code ([1ca1496](https://github.com/machinelabs/machinelabs/commit/1ca1496))
* clear output after forking ([e0a0b63](https://github.com/machinelabs/machinelabs/commit/e0a0b63))
* construct server info from name and type ([9829875](https://github.com/machinelabs/machinelabs/commit/9829875))
* correct casing in imports ([5ac75c5](https://github.com/machinelabs/machinelabs/commit/5ac75c5))
* correct env flag usage in deploy script ([fe18b56](https://github.com/machinelabs/machinelabs/commit/fe18b56))
* correct photoURL/photoUrl ([32baf70](https://github.com/machinelabs/machinelabs/commit/32baf70))
* correct wrong type annotation ([7c85857](https://github.com/machinelabs/machinelabs/commit/7c85857))
* corrects broken test ([10d22e3](https://github.com/machinelabs/machinelabs/commit/10d22e3)), closes [#76](https://github.com/machinelabs/machinelabs/issues/76)
* deactive broken material theming ([a0561d5](https://github.com/machinelabs/machinelabs/commit/a0561d5))
* delete broken test stub ([3724d4a](https://github.com/machinelabs/machinelabs/commit/3724d4a))
* disable service worker support ([7ed1a9a](https://github.com/machinelabs/machinelabs/commit/7ed1a9a))
* disable service worker support ([a40049e](https://github.com/machinelabs/machinelabs/commit/a40049e))
* don't (force) run labs on init ([0289ed2](https://github.com/machinelabs/machinelabs/commit/0289ed2))
* don't call editor.setValue with null ([a9c706c](https://github.com/machinelabs/machinelabs/commit/a9c706c)), closes [#9](https://github.com/machinelabs/machinelabs/issues/9)
* don't clear editor when editor isn't set ([64cbad0](https://github.com/machinelabs/machinelabs/commit/64cbad0))
* don't listen to latest execution in list when initializing lab ([d6720c8](https://github.com/machinelabs/machinelabs/commit/d6720c8))
* don't save twice when forking ([d5e365d](https://github.com/machinelabs/machinelabs/commit/d5e365d))
* don't show server unresponsive message when rejected ([c431969](https://github.com/machinelabs/machinelabs/commit/c431969)), closes [#143](https://github.com/machinelabs/machinelabs/issues/143)
* don't unsubscribe from output and validations ([8d87e89](https://github.com/machinelabs/machinelabs/commit/8d87e89)), closes [#85](https://github.com/machinelabs/machinelabs/issues/85)
* don't use set to update invocation ([40c419a](https://github.com/machinelabs/machinelabs/commit/40c419a))
* ensure ace editor renders new value when becoming visible ([94c64bb](https://github.com/machinelabs/machinelabs/commit/94c64bb)), closes [#239](https://github.com/machinelabs/machinelabs/issues/239)
* ensure console is clear when creating or forking labs ([c7c541a](https://github.com/machinelabs/machinelabs/commit/c7c541a)), closes [#231](https://github.com/machinelabs/machinelabs/issues/231)
* ensure execution id updates in url when running/restarting labs ([48e2d31](https://github.com/machinelabs/machinelabs/commit/48e2d31))
* ensure guard doesn't end up in limbo ([748ab58](https://github.com/machinelabs/machinelabs/commit/748ab58)), closes [#292](https://github.com/machinelabs/machinelabs/issues/292)
* ensure guard fetches latest visible execution id ([677dc59](https://github.com/machinelabs/machinelabs/commit/677dc59)), closes [#272](https://github.com/machinelabs/machinelabs/issues/272)
* ensure latest execution if broken execution id is given ([cfdcfd6](https://github.com/machinelabs/machinelabs/commit/cfdcfd6)), closes [#263](https://github.com/machinelabs/machinelabs/issues/263)
* ensure no empty fields end up in user labs collection ([dc681c2](https://github.com/machinelabs/machinelabs/commit/dc681c2))
* ensure only owner of a lab can see menu for deleting/editing executions ([9df33d7](https://github.com/machinelabs/machinelabs/commit/9df33d7))
* ensure rx do operator is available when user-profile is entry view ([1539357](https://github.com/machinelabs/machinelabs/commit/1539357))
* ensure user-profile subscribes to future route data changes ([1c7d811](https://github.com/machinelabs/machinelabs/commit/1c7d811)), closes [#260](https://github.com/machinelabs/machinelabs/issues/260)
* fix broken ref path ([1541bb6](https://github.com/machinelabs/machinelabs/commit/1541bb6))
* fix bug that lab shows wrong user ([edc9ea0](https://github.com/machinelabs/machinelabs/commit/edc9ea0)), closes [#183](https://github.com/machinelabs/machinelabs/issues/183)
* fix edit lab dialog layout ([7443ae3](https://github.com/machinelabs/machinelabs/commit/7443ae3))
* fix karma.conf and make testing work again ([3e20cd6](https://github.com/machinelabs/machinelabs/commit/3e20cd6))
* fix tests ([e7aab37](https://github.com/machinelabs/machinelabs/commit/e7aab37))
* fixes compile error that  property is always required ([71f638b](https://github.com/machinelabs/machinelabs/commit/71f638b))
* fixes regression that color foreground color was gone ([6a33bb6](https://github.com/machinelabs/machinelabs/commit/6a33bb6))
* fixes several TS errors when building for production ([eea43c4](https://github.com/machinelabs/machinelabs/commit/eea43c4))
* lab isn't updated after forking + navigation breaks when editing ([4819446](https://github.com/machinelabs/machinelabs/commit/4819446))
* lint code and force linting in CI ([8744493](https://github.com/machinelabs/machinelabs/commit/8744493)), closes [#72](https://github.com/machinelabs/machinelabs/issues/72)
* make build pass again ([be6665e](https://github.com/machinelabs/machinelabs/commit/be6665e))
* make editor take full screen ([1a53c6f](https://github.com/machinelabs/machinelabs/commit/1a53c6f)), closes [#10](https://github.com/machinelabs/machinelabs/issues/10)
* make execution meta data display correctly ([800cc56](https://github.com/machinelabs/machinelabs/commit/800cc56))
* make notification work again when server isn't responsive ([10c8aa4](https://github.com/machinelabs/machinelabs/commit/10c8aa4)), closes [#293](https://github.com/machinelabs/machinelabs/issues/293)
* make prod-build work ([e94f02f](https://github.com/machinelabs/machinelabs/commit/e94f02f))
* make rejections work again ([97acd47](https://github.com/machinelabs/machinelabs/commit/97acd47)), closes [#276](https://github.com/machinelabs/machinelabs/issues/276)
* make script executable ([848feae](https://github.com/machinelabs/machinelabs/commit/848feae))
* make sure output deals with resouce management ([6619ca1](https://github.com/machinelabs/machinelabs/commit/6619ca1))
* make sure to deploy into correct dir ([f6a7cd8](https://github.com/machinelabs/machinelabs/commit/f6a7cd8))
* make sure to swap lab directory when moving between executions ([12f6785](https://github.com/machinelabs/machinelabs/commit/12f6785)), closes [#219](https://github.com/machinelabs/machinelabs/issues/219)
* make this friggin layout work ([236e967](https://github.com/machinelabs/machinelabs/commit/236e967))
* make ToolbarMenuComponent observe user auth changes ([ab0640d](https://github.com/machinelabs/machinelabs/commit/ab0640d))
* make tooltips work again ([505bf17](https://github.com/machinelabs/machinelabs/commit/505bf17))
* make URL updates without navigation more robust ([779f81a](https://github.com/machinelabs/machinelabs/commit/779f81a)), closes [#204](https://github.com/machinelabs/machinelabs/issues/204)
* missing braces and formatting ([eed9611](https://github.com/machinelabs/machinelabs/commit/eed9611))
* observe execution for lab when its loaded ([2d20bc9](https://github.com/machinelabs/machinelabs/commit/2d20bc9)), closes [#213](https://github.com/machinelabs/machinelabs/issues/213)
* only display create button when viewing own profile ([098a7f1](https://github.com/machinelabs/machinelabs/commit/098a7f1))
* only listen for stops from current server ([d3583d3](https://github.com/machinelabs/machinelabs/commit/d3583d3))
* only show stop button for executing executionsi ([f814972](https://github.com/machinelabs/machinelabs/commit/f814972)), closes [#212](https://github.com/machinelabs/machinelabs/issues/212)
* prevent cursor from jumping ([f41d46a](https://github.com/machinelabs/machinelabs/commit/f41d46a)), closes [#8](https://github.com/machinelabs/machinelabs/issues/8)
* prevent flicker on incoming executions and reorder them ([00f7c12](https://github.com/machinelabs/machinelabs/commit/00f7c12))
* prevent user from navigating to users that don't exist ([07d2504](https://github.com/machinelabs/machinelabs/commit/07d2504))
* remove breaking placeholder test ([7317030](https://github.com/machinelabs/machinelabs/commit/7317030))
* remove lab id from URL when creating new lab ([22b5fc9](https://github.com/machinelabs/machinelabs/commit/22b5fc9)), closes [#232](https://github.com/machinelabs/machinelabs/issues/232)
* remove lab-settings entirely to fix production build ([5c24f8e](https://github.com/machinelabs/machinelabs/commit/5c24f8e))
* remove socket.io from index ([e2f50fc](https://github.com/machinelabs/machinelabs/commit/e2f50fc))
* remove support for redirects ([625e4be](https://github.com/machinelabs/machinelabs/commit/625e4be))
* remove unused code ([e27c0cf](https://github.com/machinelabs/machinelabs/commit/e27c0cf))
* remove unused operators ([94d4ebb](https://github.com/machinelabs/machinelabs/commit/94d4ebb))
* **.gitignore:** ignore all personal env configurations ([5a6cd8c](https://github.com/machinelabs/machinelabs/commit/5a6cd8c))
* **admin-cli:** do not deploy if dist is missing ([437c2ea](https://github.com/machinelabs/machinelabs/commit/437c2ea))
* **admin-cli:** make --noServer & --noFb work again ([c4ae464](https://github.com/machinelabs/machinelabs/commit/c4ae464))
* **animations:** fixes broken animations ([44902bc](https://github.com/machinelabs/machinelabs/commit/44902bc))
* **assignServer:** replace with something that works ([71d38d1](https://github.com/machinelabs/machinelabs/commit/71d38d1))
* **deployment:** generate production build ([55ff2f8](https://github.com/machinelabs/machinelabs/commit/55ff2f8))
* **docker-runner:** make /tmp writable ([02fe454](https://github.com/machinelabs/machinelabs/commit/02fe454))
* **e2e:** fix failing e2e tests ([323a24f](https://github.com/machinelabs/machinelabs/commit/323a24f))
* **e2e:** fix nondeterministic test ([b4286db](https://github.com/machinelabs/machinelabs/commit/b4286db)), closes [#162](https://github.com/machinelabs/machinelabs/issues/162)
* **e2e:** make e2e setup work again ([fd04060](https://github.com/machinelabs/machinelabs/commit/fd04060))
* **editor:** set correct value when value input changes ([9b460b2](https://github.com/machinelabs/machinelabs/commit/9b460b2))
* **editor-view:** fix scrolling/height issues in editor view ([6f30750](https://github.com/machinelabs/machinelabs/commit/6f30750))
* **EditorView:** always show fork button ([bc81221](https://github.com/machinelabs/machinelabs/commit/bc81221))
* **EditorView:** ensure executions are reinitialized when forking ([867636d](https://github.com/machinelabs/machinelabs/commit/867636d)), closes [#294](https://github.com/machinelabs/machinelabs/issues/294) [#295](https://github.com/machinelabs/machinelabs/issues/295)
* **FileNameDialog:** allow all file types ([5395209](https://github.com/machinelabs/machinelabs/commit/5395209)), closes [#67](https://github.com/machinelabs/machinelabs/issues/67)
* **gitignore:** corrects typo in exclude ([81a2106](https://github.com/machinelabs/machinelabs/commit/81a2106))
* **gulp:** restore root tsconfig.json ([3ccab71](https://github.com/machinelabs/machinelabs/commit/3ccab71))
* **hasPlanRule:** make sure to check for user ([de61b73](https://github.com/machinelabs/machinelabs/commit/de61b73))
* **Lab:** userId should be user_id everywhere ([ee611b6](https://github.com/machinelabs/machinelabs/commit/ee611b6))
* **lab.resolver.spec:** make test compile again ([c224058](https://github.com/machinelabs/machinelabs/commit/c224058))
* **lab.resolver.spec:** make tests green again ([b68511a](https://github.com/machinelabs/machinelabs/commit/b68511a))
* **LabResolver:** fixes bug that resolver emits wrong object when lab doesn't exist ([691e638](https://github.com/machinelabs/machinelabs/commit/691e638))
* **lint:** use config dir, src updates to pass tslint ([14a64a7](https://github.com/machinelabs/machinelabs/commit/14a64a7))
* **messagingService:** correct path to node ([33c7c28](https://github.com/machinelabs/machinelabs/commit/33c7c28)), closes [#86](https://github.com/machinelabs/machinelabs/issues/86)
* **MessagingService:** remove unneeded code ([90a2872](https://github.com/machinelabs/machinelabs/commit/90a2872))
* **package.json:** fix tslint script ([8530ee5](https://github.com/machinelabs/machinelabs/commit/8530ee5))
* **PanelComponent:** fix broken test ([d11be50](https://github.com/machinelabs/machinelabs/commit/d11be50))
* **Readme:** adjust deploy instructions ([6886a3f](https://github.com/machinelabs/machinelabs/commit/6886a3f))
* **rleService:** ensure stream is shared ([781e8cf](https://github.com/machinelabs/machinelabs/commit/781e8cf))
* **routes:** correct used route dsl ([f5560ee](https://github.com/machinelabs/machinelabs/commit/f5560ee)), closes [#100](https://github.com/machinelabs/machinelabs/issues/100)
* **rulesService:** guard around non-existing user ([3128ebc](https://github.com/machinelabs/machinelabs/commit/3128ebc))
* **theme:** make theme work again ([fd3017d](https://github.com/machinelabs/machinelabs/commit/fd3017d)), closes [#93](https://github.com/machinelabs/machinelabs/issues/93)
* **Toolbar:** add FlexLayoutModule dependency ([eb4c809](https://github.com/machinelabs/machinelabs/commit/eb4c809))
* **Toolbar:** focus name input when it's toggled ([aef9cf1](https://github.com/machinelabs/machinelabs/commit/aef9cf1))
* removes workaround for missing Observable type ([2b975ab](https://github.com/machinelabs/machinelabs/commit/2b975ab))
* return null for non-existing data ([6c8d4bd](https://github.com/machinelabs/machinelabs/commit/6c8d4bd))
* run/stop button should display accurately ([853dac0](https://github.com/machinelabs/machinelabs/commit/853dac0)), closes [#131](https://github.com/machinelabs/machinelabs/issues/131)
* show information when no execution data is available ([0a08c92](https://github.com/machinelabs/machinelabs/commit/0a08c92)), closes [#230](https://github.com/machinelabs/machinelabs/issues/230)
* show run button only when user owns lab ([643146f](https://github.com/machinelabs/machinelabs/commit/643146f)), closes [#194](https://github.com/machinelabs/machinelabs/issues/194)
* show stop and restart button only if user owns execution ([39d16da](https://github.com/machinelabs/machinelabs/commit/39d16da)), closes [#216](https://github.com/machinelabs/machinelabs/issues/216)
* suppress webpack warning during build ([8c55a67](https://github.com/machinelabs/machinelabs/commit/8c55a67)), closes [#49](https://github.com/machinelabs/machinelabs/issues/49) [#49](https://github.com/machinelabs/machinelabs/issues/49)
* supress ace editor blockscrolling warning ([922c2aa](https://github.com/machinelabs/machinelabs/commit/922c2aa))
* sync status and ensure Finished isn't set while actually running ([2da6b79](https://github.com/machinelabs/machinelabs/commit/2da6b79))
* trace down execution for stop invocations ([4b952b4](https://github.com/machinelabs/machinelabs/commit/4b952b4)), closes [#84](https://github.com/machinelabs/machinelabs/issues/84)
* update latest lab in memory when running lab ([2a91789](https://github.com/machinelabs/machinelabs/commit/2a91789))
* update rx to accidentially unsubscribing executions ([a37c7ca](https://github.com/machinelabs/machinelabs/commit/a37c7ca))
* update user when provider changes ([2c2c14d](https://github.com/machinelabs/machinelabs/commit/2c2c14d))
* **ui/ux:** activate editor tab after new lab has been created ([5b9fbc6](https://github.com/machinelabs/machinelabs/commit/5b9fbc6))
* **xor-lab:** make it work with Python 3 ([485a701](https://github.com/machinelabs/machinelabs/commit/485a701))
* use  enum instead of numbers ([1b29279](https://github.com/machinelabs/machinelabs/commit/1b29279))
* use databaseURL specified in environment file ([95462ec](https://github.com/machinelabs/machinelabs/commit/95462ec))
* use envirnomnent in ml-firebase ([3594e78](https://github.com/machinelabs/machinelabs/commit/3594e78))
* use InjectionToken, OpaqueToken is deprecated ([d8a8a9c](https://github.com/machinelabs/machinelabs/commit/d8a8a9c))
* wait for execution to start before navigating to it ([93a26a5](https://github.com/machinelabs/machinelabs/commit/93a26a5)), closes [#267](https://github.com/machinelabs/machinelabs/issues/267)
* wrap output in pre tags to preserve line breaks ([a819812](https://github.com/machinelabs/machinelabs/commit/a819812))


### Features

* add basic service worker support ([5d5722b](https://github.com/machinelabs/machinelabs/commit/5d5722b))
* add cloud function to save user lab ids ([667c723](https://github.com/machinelabs/machinelabs/commit/667c723))
* add dialog variant for ExceedsMaximumConcurrency rejection ([e1dcedf](https://github.com/machinelabs/machinelabs/commit/e1dcedf))
* add favicons ([9910860](https://github.com/machinelabs/machinelabs/commit/9910860))
* add function to update lab_visible_executions ref ([b200af9](https://github.com/machinelabs/machinelabs/commit/b200af9))
* add language helper methods ([ee7238e](https://github.com/machinelabs/machinelabs/commit/ee7238e))
* add material menu ([f2a7e8c](https://github.com/machinelabs/machinelabs/commit/f2a7e8c))
* add missing APIs to ObservableDbRef ([4df8cee](https://github.com/machinelabs/machinelabs/commit/4df8cee))
* add new logo to app ([5b1b225](https://github.com/machinelabs/machinelabs/commit/5b1b225))
* add resolver + validator to check for left credits ([48cc5bf](https://github.com/machinelabs/machinelabs/commit/48cc5bf))
* add share dialog ([1a90ad3](https://github.com/machinelabs/machinelabs/commit/1a90ad3)), closes [#123](https://github.com/machinelabs/machinelabs/issues/123)
* add UsageStatisticService to calc UsageStatistic ([28660d6](https://github.com/machinelabs/machinelabs/commit/28660d6))
* adds API to stop running lab ([082ec3c](https://github.com/machinelabs/machinelabs/commit/082ec3c))
* adds new rejection dialogs ([f325e60](https://github.com/machinelabs/machinelabs/commit/f325e60))
* adds scss theme for machinelabs ([99eee7f](https://github.com/machinelabs/machinelabs/commit/99eee7f))
* adds takeWhileInclusive operator ([3b81878](https://github.com/machinelabs/machinelabs/commit/3b81878))
* allow different configs ([2520169](https://github.com/machinelabs/machinelabs/commit/2520169)), closes [#19](https://github.com/machinelabs/machinelabs/issues/19)
* allow forking of labs ([210d244](https://github.com/machinelabs/machinelabs/commit/210d244))
* allow users to restart existing execution ([4b77b08](https://github.com/machinelabs/machinelabs/commit/4b77b08)), closes [#178](https://github.com/machinelabs/machinelabs/issues/178)
* allow users to undo the hiding/removing of executions ([d1b1d00](https://github.com/machinelabs/machinelabs/commit/d1b1d00))
* assign random server to invocation ([bf2f2a0](https://github.com/machinelabs/machinelabs/commit/bf2f2a0))
* auto run labs that have a cached run ([75652dd](https://github.com/machinelabs/machinelabs/commit/75652dd))
* auto view  first existing execution ([61f3913](https://github.com/machinelabs/machinelabs/commit/61f3913))
* clear console output before executing lab ([b2931df](https://github.com/machinelabs/machinelabs/commit/b2931df)), closes [#144](https://github.com/machinelabs/machinelabs/issues/144)
* create index for index (hoho) ([de0ef37](https://github.com/machinelabs/machinelabs/commit/de0ef37))
* display execution started message ([c17b0d9](https://github.com/machinelabs/machinelabs/commit/c17b0d9))
* enable server side multiple file support ([5f11958](https://github.com/machinelabs/machinelabs/commit/5f11958))
* enable stopping of running labs ([7e0be91](https://github.com/machinelabs/machinelabs/commit/7e0be91)), closes [#12](https://github.com/machinelabs/machinelabs/issues/12)
* enable users to edit execution names ([2c2901b](https://github.com/machinelabs/machinelabs/commit/2c2901b)), closes [#197](https://github.com/machinelabs/machinelabs/issues/197)
* enable users to hide executions from execution list ([d6bd685](https://github.com/machinelabs/machinelabs/commit/d6bd685)), closes [#218](https://github.com/machinelabs/machinelabs/issues/218)
* enforce a 5g disk quota ([67971e6](https://github.com/machinelabs/machinelabs/commit/67971e6)), closes [#35](https://github.com/machinelabs/machinelabs/issues/35)
* ensure labs are saved when executed for the first time ([1b2cec4](https://github.com/machinelabs/machinelabs/commit/1b2cec4)), closes [#192](https://github.com/machinelabs/machinelabs/issues/192)
* extract editor footer into its own component ([d893ffd](https://github.com/machinelabs/machinelabs/commit/d893ffd))
* fake remote code execution and messaging ([497c85a](https://github.com/machinelabs/machinelabs/commit/497c85a))
* first rough file explorer implementation ([deddbf4](https://github.com/machinelabs/machinelabs/commit/deddbf4))
* first take on persistent labs ([73642ab](https://github.com/machinelabs/machinelabs/commit/73642ab))
* handle rejected executions ([6b64752](https://github.com/machinelabs/machinelabs/commit/6b64752))
* implement basic code execution infrastructure ([e278bdb](https://github.com/machinelabs/machinelabs/commit/e278bdb))
* implement basic UI and server communication ([8bbe649](https://github.com/machinelabs/machinelabs/commit/8bbe649))
* improves readme and removes deprecated script ([6f1ed14](https://github.com/machinelabs/machinelabs/commit/6f1ed14))
* introduce `SharedModule` ([be738e3](https://github.com/machinelabs/machinelabs/commit/be738e3))
* introduce `TruncateWordsPipe` ([d3a7d27](https://github.com/machinelabs/machinelabs/commit/d3a7d27))
* introduce DistanceInWordsStrictPipe ([4ce73b1](https://github.com/machinelabs/machinelabs/commit/4ce73b1))
* introduce editor layout components and use them in EditorViewComponent ([830b843](https://github.com/machinelabs/machinelabs/commit/830b843))
* introduce EditorService ([e59ada5](https://github.com/machinelabs/machinelabs/commit/e59ada5))
* introduce EmbeddedEditorViewComponent ([43abea4](https://github.com/machinelabs/machinelabs/commit/43abea4))
* introduce execution list component in favour of execution metadata ([9a58a4c](https://github.com/machinelabs/machinelabs/commit/9a58a4c))
* introduce ExecutionStatusPipe ([170ab59](https://github.com/machinelabs/machinelabs/commit/170ab59))
* introduce firebase function to create lab_executions nodes ([a05cb30](https://github.com/machinelabs/machinelabs/commit/a05cb30))
* introduce first version of execution view in user profile ([41eda70](https://github.com/machinelabs/machinelabs/commit/41eda70)), closes [#187](https://github.com/machinelabs/machinelabs/issues/187)
* introduce HasExecutionGuard ([ca66495](https://github.com/machinelabs/machinelabs/commit/ca66495)), closes [#241](https://github.com/machinelabs/machinelabs/issues/241)
* introduce index property on execution message ([17f0e66](https://github.com/machinelabs/machinelabs/commit/17f0e66))
* introduce LabEditorModule ([0db1657](https://github.com/machinelabs/machinelabs/commit/0db1657)), closes [#101](https://github.com/machinelabs/machinelabs/issues/101)
* introduce LabExecutionService ([b4c136b](https://github.com/machinelabs/machinelabs/commit/b4c136b)), closes [#195](https://github.com/machinelabs/machinelabs/issues/195)
* introduce MessageKind.ExecutionStarted ([ff4bbd5](https://github.com/machinelabs/machinelabs/commit/ff4bbd5))
* Introduce MessageKind.ExecutionStarted ([d5b5bbf](https://github.com/machinelabs/machinelabs/commit/d5b5bbf)), closes [/github.com/machinelabs/machinelabs-server/pull/52#issuecomment-302020955](https://github.com//github.com/machinelabs/machinelabs-server/pull/52/issues/issuecomment-302020955)
* **AceEditor:** teach component theme and showPrintMargin properties ([2dcec81](https://github.com/machinelabs/machinelabs/commit/2dcec81))
* **admin-cli:** enforce recreation of node_modules for deployments ([e6e678b](https://github.com/machinelabs/machinelabs/commit/e6e678b))
* **admin-cli:** handle client deployment via admin-cli ([6f99e83](https://github.com/machinelabs/machinelabs/commit/6f99e83))
* **admin-cli:** introduce cut command ([a1ea8d0](https://github.com/machinelabs/machinelabs/commit/a1ea8d0))
* **admin-cli:** make env configureable ([855d67c](https://github.com/machinelabs/machinelabs/commit/855d67c))
* update has_cached_run on execution ([1660d87](https://github.com/machinelabs/machinelabs/commit/1660d87))
* **admin-cli:** prevent deployments from non-tags ([9b70e13](https://github.com/machinelabs/machinelabs/commit/9b70e13))
* introduce name field in Execution type ([0103bb5](https://github.com/machinelabs/machinelabs/commit/0103bb5))
* introduce panel-title component ([f22caff](https://github.com/machinelabs/machinelabs/commit/f22caff))
* introduce reusable UI components for dialogs ([9bc0351](https://github.com/machinelabs/machinelabs/commit/9bc0351))
* introduce rules to protect user id and user email from writing ([6fcb709](https://github.com/machinelabs/machinelabs/commit/6fcb709))
* introduce stubs for DATABASE and AuthService ([dd6cf31](https://github.com/machinelabs/machinelabs/commit/dd6cf31))
* introduce user_visible_executions node ([5b94405](https://github.com/machinelabs/machinelabs/commit/5b94405))
* introduce UserService ([073c213](https://github.com/machinelabs/machinelabs/commit/073c213))
* introduces EditorSnackbarService ([c7b513b](https://github.com/machinelabs/machinelabs/commit/c7b513b)), closes [#107](https://github.com/machinelabs/machinelabs/issues/107) [#107](https://github.com/machinelabs/machinelabs/issues/107)
* isolate lab files from each other ([173ca74](https://github.com/machinelabs/machinelabs/commit/173ca74)), closes [#4](https://github.com/machinelabs/machinelabs/issues/4)
* kill old lab processes when lab re-runs ([0bb69a0](https://github.com/machinelabs/machinelabs/commit/0bb69a0))
* limit number of parallel executions ([79596b4](https://github.com/machinelabs/machinelabs/commit/79596b4)), closes [#6](https://github.com/machinelabs/machinelabs/issues/6)
* make docker image selectable ([7337c5b](https://github.com/machinelabs/machinelabs/commit/7337c5b))
* make execution-metadata themable ([770c44e](https://github.com/machinelabs/machinelabs/commit/770c44e))
* make executions selectable via url parameter ([ae48ec8](https://github.com/machinelabs/machinelabs/commit/ae48ec8)), closes [#242](https://github.com/machinelabs/machinelabs/issues/242) [#196](https://github.com/machinelabs/machinelabs/issues/196)
* make file tree themable ([3fc666d](https://github.com/machinelabs/machinelabs/commit/3fc666d))
* make firebase rules reusable ([ad0fcea](https://github.com/machinelabs/machinelabs/commit/ad0fcea))
* make ids unique ([0cb45fd](https://github.com/machinelabs/machinelabs/commit/0cb45fd))
* make invocation.server only writeable for cloudFn ([338c1b7](https://github.com/machinelabs/machinelabs/commit/338c1b7))
* make it possible to view existing executions ([017335a](https://github.com/machinelabs/machinelabs/commit/017335a))
* make machinelabs work offline ([aef41d2](https://github.com/machinelabs/machinelabs/commit/aef41d2))
* make ml-dialog themable ([e368069](https://github.com/machinelabs/machinelabs/commit/e368069))
* make panel themable ([edca10b](https://github.com/machinelabs/machinelabs/commit/edca10b))
* make Toolbar more reusable by providing content projection hooks ([902f0b6](https://github.com/machinelabs/machinelabs/commit/902f0b6))
* move UI into editor-view ([4d6fa61](https://github.com/machinelabs/machinelabs/commit/4d6fa61))
* no redirected executions ([4dfb062](https://github.com/machinelabs/machinelabs/commit/4dfb062))
* notify on snackbar when lab was stopped ([ba927d0](https://github.com/machinelabs/machinelabs/commit/ba927d0)), closes [#29](https://github.com/machinelabs/machinelabs/issues/29)
* notify user about running executions when trying to leave editor view ([272b8b4](https://github.com/machinelabs/machinelabs/commit/272b8b4)), closes [#214](https://github.com/machinelabs/machinelabs/issues/214)
* overhaul execution API ([3e82898](https://github.com/machinelabs/machinelabs/commit/3e82898)), closes [#199](https://github.com/machinelabs/machinelabs/issues/199)
* pick up messages from redirected output ([cc65ba7](https://github.com/machinelabs/machinelabs/commit/cc65ba7)), closes [#46](https://github.com/machinelabs/machinelabs/issues/46)
* provide execution on context ([652a5a5](https://github.com/machinelabs/machinelabs/commit/652a5a5))
* provide more meta data about executions ([673a23c](https://github.com/machinelabs/machinelabs/commit/673a23c))
* put hardware_type on execution ([960b8eb](https://github.com/machinelabs/machinelabs/commit/960b8eb))
* re-introduce edit lab dialog ([47b23b0](https://github.com/machinelabs/machinelabs/commit/47b23b0))
* read configuration from ml.yaml ([95cfa66](https://github.com/machinelabs/machinelabs/commit/95cfa66))
* read server from config and listen only for own invocations ([3fd18ef](https://github.com/machinelabs/machinelabs/commit/3fd18ef))
* redesign stop feature ([b171164](https://github.com/machinelabs/machinelabs/commit/b171164)), closes [#198](https://github.com/machinelabs/machinelabs/issues/198) [#193](https://github.com/machinelabs/machinelabs/issues/193)
* redirect users after login when displayName is undefined ([111105d](https://github.com/machinelabs/machinelabs/commit/111105d)), closes [#99](https://github.com/machinelabs/machinelabs/issues/99) [#99](https://github.com/machinelabs/machinelabs/issues/99)
* reject executions from anonymous user ([fd3a167](https://github.com/machinelabs/machinelabs/commit/fd3a167))
* **auth:** implement GitHub login using firebase ([907a6d3](https://github.com/machinelabs/machinelabs/commit/907a6d3))
* **CostCalculator:** introduce util to calc costs ([9d04739](https://github.com/machinelabs/machinelabs/commit/9d04739))
* **Date:** add util to get UTC start/end of month ([36e4b6e](https://github.com/machinelabs/machinelabs/commit/36e4b6e))
* **docker-runner:** allow internet usage ([fce5627](https://github.com/machinelabs/machinelabs/commit/fce5627))
* **docker-runner:** remove memory limit ([2e7d8cc](https://github.com/machinelabs/machinelabs/commit/2e7d8cc))
* **doneWhen:** adds assertBeforeDone functionality ([74cf80b](https://github.com/machinelabs/machinelabs/commit/74cf80b))
* **e2e:** add basic suite of e2e tests ([da478c1](https://github.com/machinelabs/machinelabs/commit/da478c1)), closes [#108](https://github.com/machinelabs/machinelabs/issues/108)
* **EditLabDialog:** adds dialog to edit lab metadata ([b219511](https://github.com/machinelabs/machinelabs/commit/b219511))
* **EditLabDialog:** teach dialog component config object ([573bc1c](https://github.com/machinelabs/machinelabs/commit/573bc1c)), closes [/github.com/machinelabs/machinelabs-client/pull/106#issuecomment-296401676](https://github.com//github.com/machinelabs/machinelabs-client/pull/106/issues/issuecomment-296401676)
* **editor:** bind editor value two-way ([fd695ea](https://github.com/machinelabs/machinelabs/commit/fd695ea))
* **editor:** teach editor configurable modes ([22b3068](https://github.com/machinelabs/machinelabs/commit/22b3068))
* **editor:** teach editor highlight active line input ([77701a6](https://github.com/machinelabs/machinelabs/commit/77701a6))
* **editor:** this integrates ace editor using an angular component ([a27c486](https://github.com/machinelabs/machinelabs/commit/a27c486))
* **EditorService:** introduce listenAndNotify() method ([8db2d01](https://github.com/machinelabs/machinelabs/commit/8db2d01))
* **EditorView:** add button for creating new labs ([cdf7ed8](https://github.com/machinelabs/machinelabs/commit/cdf7ed8)), closes [#33](https://github.com/machinelabs/machinelabs/issues/33)
* **EditorView:** add support for linking anonymous users with permanent users ([ba70620](https://github.com/machinelabs/machinelabs/commit/ba70620)), closes [#38](https://github.com/machinelabs/machinelabs/issues/38) [#38](https://github.com/machinelabs/machinelabs/issues/38)
* **EditorView:** allow changing file names ([e09468c](https://github.com/machinelabs/machinelabs/commit/e09468c))
* **FileNameDialog:** pre-fill form with file name if one is given ([dd68425](https://github.com/machinelabs/machinelabs/commit/dd68425))
* **filetree:** introduces file tree component ([0726f1a](https://github.com/machinelabs/machinelabs/commit/0726f1a))
* serve requested runs from cache if possible ([635dfe3](https://github.com/machinelabs/machinelabs/commit/635dfe3))
* **FileTreeComponent:** add editFile Ouput and and DOM ([a897d98](https://github.com/machinelabs/machinelabs/commit/a897d98))
* **LabConfigService:** add service to read ml.yaml ([e54a77b](https://github.com/machinelabs/machinelabs/commit/e54a77b))
* **LabStorage:** return Observable<Lab> in createLab ([e29025e](https://github.com/machinelabs/machinelabs/commit/e29025e))
* **LabStorageService:** add createLabFromTemplate() method ([889a991](https://github.com/machinelabs/machinelabs/commit/889a991)), closes [#34](https://github.com/machinelabs/machinelabs/issues/34) [#33](https://github.com/machinelabs/machinelabs/issues/33) [#34](https://github.com/machinelabs/machinelabs/issues/34)
* **LocationHelper:** introduce LocationHelper service ([8a153bc](https://github.com/machinelabs/machinelabs/commit/8a153bc))
* **LocationHelper:** introduce openInNewTab() method ([3cc34a4](https://github.com/machinelabs/machinelabs/commit/3cc34a4))
* **messagingService:** provide serverId on execution ([642634a](https://github.com/machinelabs/machinelabs/commit/642634a))
* **ml.yaml:** provide default file ([a3f771c](https://github.com/machinelabs/machinelabs/commit/a3f771c))
* reject executions if server is over capacity ([dde776b](https://github.com/machinelabs/machinelabs/commit/dde776b))
* revamp validation system & introduce ExecutionRejectionInfo ([45e8b18](https://github.com/machinelabs/machinelabs/commit/45e8b18))
* secure all database rules ([0ba3f8b](https://github.com/machinelabs/machinelabs/commit/0ba3f8b)), closes [#56](https://github.com/machinelabs/machinelabs/issues/56)
* send message data for user to see that execution has started ([c6856d0](https://github.com/machinelabs/machinelabs/commit/c6856d0)), closes [#81](https://github.com/machinelabs/machinelabs/issues/81)
* set "redirected" property on execution" ([c66945e](https://github.com/machinelabs/machinelabs/commit/c66945e))
* show lab execution status when lab finished executing ([1c00296](https://github.com/machinelabs/machinelabs/commit/1c00296)), closes [#103](https://github.com/machinelabs/machinelabs/issues/103)
* show notifications for events ([5671ada](https://github.com/machinelabs/machinelabs/commit/5671ada)), closes [#28](https://github.com/machinelabs/machinelabs/issues/28)
* show rejection dialog when anonymous users try to run lab ([b77bf8f](https://github.com/machinelabs/machinelabs/commit/b77bf8f)), closes [#110](https://github.com/machinelabs/machinelabs/issues/110) [#110](https://github.com/machinelabs/machinelabs/issues/110)
* show restore message when viewing execution that's different from lab ([7fdbbcc](https://github.com/machinelabs/machinelabs/commit/7fdbbcc)), closes [#280](https://github.com/machinelabs/machinelabs/issues/280)
* show snackbar message when ml.yaml is invalid ([cce6d35](https://github.com/machinelabs/machinelabs/commit/cce6d35))
* show snackbar when server doesn't respond ([b890649](https://github.com/machinelabs/machinelabs/commit/b890649)), closes [#135](https://github.com/machinelabs/machinelabs/issues/135)
* show used runner on startup ([1078071](https://github.com/machinelabs/machinelabs/commit/1078071))
* some common sandboxing ([8e27713](https://github.com/machinelabs/machinelabs/commit/8e27713)), closes [#8](https://github.com/machinelabs/machinelabs/issues/8)
* some visual quick wins ([f27414d](https://github.com/machinelabs/machinelabs/commit/f27414d))
* sort user labs by latest modification ([02dd8d1](https://github.com/machinelabs/machinelabs/commit/02dd8d1))
* store invocation lab with execution ([729f525](https://github.com/machinelabs/machinelabs/commit/729f525))
* support multiple files per lab ([1696cd5](https://github.com/machinelabs/machinelabs/commit/1696cd5))
* teach FileTreeComponent input to hide action buttons ([a179882](https://github.com/machinelabs/machinelabs/commit/a179882))
* teach lab type create_at and modified_at ([33bfaef](https://github.com/machinelabs/machinelabs/commit/33bfaef))
* teach Lab type created_at and modified_at fields ([f6e16ff](https://github.com/machinelabs/machinelabs/commit/f6e16ff))
* teaches editor readOnly and showGutter ([3f4ee04](https://github.com/machinelabs/machinelabs/commit/3f4ee04))
* theme execution status component ([c60bb0e](https://github.com/machinelabs/machinelabs/commit/c60bb0e))
* **ObservableDbRef:** add "on" and "value" ([57fa623](https://github.com/machinelabs/machinelabs/commit/57fa623))
* **ObservableDbRef:** add support for missing fb APIs ([1267203](https://github.com/machinelabs/machinelabs/commit/1267203))
* **ObservableDbRef:** add support for update ([4573387](https://github.com/machinelabs/machinelabs/commit/4573387))
* **profile:** add profile route ([d5befb3](https://github.com/machinelabs/machinelabs/commit/d5befb3)), closes [#66](https://github.com/machinelabs/machinelabs/issues/66)
* **rleService:** handle large outputs more efficiently ([ce5a163](https://github.com/machinelabs/machinelabs/commit/ce5a163)), closes [#220](https://github.com/machinelabs/machinelabs/issues/220)
* **rleService:** introduce listen API ([f683507](https://github.com/machinelabs/machinelabs/commit/f683507))
* **rules:** add rule to check for user plan ([fd6441a](https://github.com/machinelabs/machinelabs/commit/fd6441a)), closes [#39](https://github.com/machinelabs/machinelabs/issues/39)
* **takeWhileInclusive:** annotate with types ([9f1ce4d](https://github.com/machinelabs/machinelabs/commit/9f1ce4d))
* **Toolbar:** allow user to change lab name ([8536308](https://github.com/machinelabs/machinelabs/commit/8536308)), closes [#44](https://github.com/machinelabs/machinelabs/issues/44) [#44](https://github.com/machinelabs/machinelabs/issues/44)
* **Toolbar:** show lab owner info ([e5234ab](https://github.com/machinelabs/machinelabs/commit/e5234ab)), closes [#66](https://github.com/machinelabs/machinelabs/issues/66) [#92](https://github.com/machinelabs/machinelabs/issues/92)
* **ui:** add tabs for separate console output window ([db59839](https://github.com/machinelabs/machinelabs/commit/db59839))
* **ui:** introduce execution status component ([158516c](https://github.com/machinelabs/machinelabs/commit/158516c))
* **ui:** make UI look nice ([aba086b](https://github.com/machinelabs/machinelabs/commit/aba086b)), closes [#17](https://github.com/machinelabs/machinelabs/issues/17) [#41](https://github.com/machinelabs/machinelabs/issues/41) [#17](https://github.com/machinelabs/machinelabs/issues/17) [#41](https://github.com/machinelabs/machinelabs/issues/41)
* turn deploy scripts into CLI ([5cc32f0](https://github.com/machinelabs/machinelabs/commit/5cc32f0)), closes [#40](https://github.com/machinelabs/machinelabs/issues/40)
* **ui:** render lab description and tags ([112dbd9](https://github.com/machinelabs/machinelabs/commit/112dbd9)), closes [#69](https://github.com/machinelabs/machinelabs/issues/69)
* toggle between run and stop button ([9851f09](https://github.com/machinelabs/machinelabs/commit/9851f09)), closes [#12](https://github.com/machinelabs/machinelabs/issues/12)
* use firebase for communication to runner ([6a65611](https://github.com/machinelabs/machinelabs/commit/6a65611))
* use firebase to stream output ([52a2bae](https://github.com/machinelabs/machinelabs/commit/52a2bae)), closes [#7](https://github.com/machinelabs/machinelabs/issues/7) [#15](https://github.com/machinelabs/machinelabs/issues/15)
* use firebase-admin for authentication ([f6e4012](https://github.com/machinelabs/machinelabs/commit/f6e4012)), closes [#45](https://github.com/machinelabs/machinelabs/issues/45)
* use LabConfigService to read real config ([841968d](https://github.com/machinelabs/machinelabs/commit/841968d))
* use proper routes instead of query params ([b5d9458](https://github.com/machinelabs/machinelabs/commit/b5d9458))
* use resolver to wait for lab to be fetched ([14fa307](https://github.com/machinelabs/machinelabs/commit/14fa307))
* use snackbar for cached/completed notifications ([c8eb7cb](https://github.com/machinelabs/machinelabs/commit/c8eb7cb)), closes [#29](https://github.com/machinelabs/machinelabs/issues/29)
* **UserProfile:** let users edit their profile info ([397ce9a](https://github.com/machinelabs/machinelabs/commit/397ce9a)), closes [#153](https://github.com/machinelabs/machinelabs/issues/153)
* **UserService:** add method to perform firebase ref updates ([fee4df4](https://github.com/machinelabs/machinelabs/commit/fee4df4))
* **ux:** make active file configurable via URL ([f50dcd7](https://github.com/machinelabs/machinelabs/commit/f50dcd7))
* **validations:** more flexible implementation ([161ecda](https://github.com/machinelabs/machinelabs/commit/161ecda))
* **ValidationService:** introduce concept of Resolver ([934873c](https://github.com/machinelabs/machinelabs/commit/934873c))
* use up to date keras version ([8a3a010](https://github.com/machinelabs/machinelabs/commit/8a3a010))
* write idx/user_execution index ([21544b1](https://github.com/machinelabs/machinelabs/commit/21544b1))
