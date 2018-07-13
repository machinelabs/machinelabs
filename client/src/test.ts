// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

declare const require: any;
declare const ace: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserDynamicTestingModule, NoopAnimationsModule], platformBrowserDynamicTesting());
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts/);
// And load the modules.
context.keys().map(context);
