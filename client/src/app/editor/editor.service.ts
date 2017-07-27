import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from '../util/location-helper';

import { File, Lab } from '../models/lab';

export enum TabIndex {
  Editor,
  Console,
  Settings
}

@Injectable()
export class EditorService {

  selectedTab: TabIndex;

  lab: Lab;

  latestLab: Lab;

  activeFile: File;

  constructor(
    private urlSerializer: UrlSerializer,
    private location: Location,
    private locationHelper: LocationHelper
  ) {}

  initLab(lab: Lab) {
    this.lab = lab;
    this.latestLab = Object.assign({}, this.lab);
    this.initActiveFile();
  }

  initDirectory(directory: Array<File>) {
    this.lab.directory = directory;
    this.initActiveFile();
  }

  selectTab(tabIndex: TabIndex) {
    this.selectedTab = tabIndex;
  }

  openFile(file: File) {
    this.activeFile = file;
    this.locationHelper.updateQueryParams(this.location.path(), {
      file: file.name,
    });
  }

  tabActive(tabIndex: TabIndex) {
    return this.selectedTab === tabIndex;
  }

  selectEditorTab() {
    this.selectTab(TabIndex.Editor);
  }

  selectConsoleTab() {
    this.selectTab(TabIndex.Console);
  }

  editorTabActive() {
    return this.tabActive(TabIndex.Editor);
  }

  consoleTabActive() {
    return this.tabActive(TabIndex.Console);
  }

  private initActiveFile() {
    const file = this.lab.directory
      .find(f => f.name === this.urlSerializer.parse(this.location.path()).queryParams.file);
    this.openFile(file || this.lab.directory[0]);
  }

}
