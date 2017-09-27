import { Injectable } from '@angular/core';
import { NavigationExtras, Router, UrlSerializer } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { WindowRef } from '../window-ref.service';

@Injectable()
export class LocationHelper {

  constructor(
    private location: Location,
    private router: Router,
    private urlSerializer: UrlSerializer,
    private locationStrategy: LocationStrategy,
    private windowRef: WindowRef
  ) { }

  updateUrl(urlSegments: string[], options: NavigationExtras) {
    this.location.go(this.urlSerializer.serialize(
      this.router.createUrlTree(urlSegments, options)
    ));
  }

  getQueryParams(path: string) {
    const currentUrlTree = this.router.parseUrl(path);
    return currentUrlTree.queryParams;
  }

  updateQueryParams(path: string, params) {
    const currentUrlTree = this.router.parseUrl(path);
    currentUrlTree.queryParams = Object.assign({}, currentUrlTree.queryParams, params);

    this.location.go(this.urlSerializer.serialize(currentUrlTree));
  }

  removeQueryParams(path: string, keys: Array<string> | string) {
    const currentUrlTree = this.router.parseUrl(path);

    for (let key of [].concat(keys)) {
      delete currentUrlTree.queryParams[key];
    }

    this.location.go(this.urlSerializer.serialize(currentUrlTree));
  }

  openInNewTab(urlSegments: string[]) {
    this.windowRef.nativeWindow.open(this.prepareExternalUrl(urlSegments));
  }

  prepareExternalUrl(urlSegments: string[], withHost = false) {
    const urlTree = this.router.createUrlTree(urlSegments);
    const url = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(urlTree));
    const location = this.windowRef.nativeWindow.location;
    return withHost ? `${location.protocol}//${location.host}${url}` : url;
  }

  getRootUrlSegment(): string {
    return this.windowRef.nativeWindow.location.pathname.split('/')[1];
  }
}
