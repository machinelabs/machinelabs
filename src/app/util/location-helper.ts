import { Injectable } from '@angular/core';
import { NavigationExtras, Router, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class LocationHelper {

  constructor(
    private location: Location,
    private router: Router,
    private urlSerializer: UrlSerializer
  ) {}

  updateUrl(urlSegments: string[], options: NavigationExtras) {
    this.location.go(this.urlSerializer.serialize(
      this.router.createUrlTree(urlSegments, options)
    ));
  }
}
