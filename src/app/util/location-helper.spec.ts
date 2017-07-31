import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from './location-helper';
import { WindowRef } from '../window-ref.service';


let windowStub = {
  nativeWindow: {
    open: () => {}
  }
}

describe('LocationHelper', () => {

  let locationHelper: LocationHelper;
  let location: Location;
  let windowRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LocationHelper,
        { provide: WindowRef, useValue: windowStub }
      ]
    });

    locationHelper = TestBed.get(LocationHelper);
    location = TestBed.get(Location);
    windowRef = TestBed.get(WindowRef);
  });

  describe('.updateQueryParams', () => {

    it('should add query parameters of given url', () => {
      locationHelper.updateQueryParams('/my/app', {
        foo: 'bar'
      });

      expect(location.path()).toEqual('/my/app?foo=bar');
    });

    it('should update query parameters of given url', () => {
      locationHelper.updateQueryParams('/my/app?foo=foo', {
        foo: 'bar'
      });

      expect(location.path()).toEqual('/my/app?foo=bar');
    });
  });

  describe('.openInNewTab()', () => {

    it('should generate link and open in new tab', () => {
      const urlSegments = ['/foo', 'bar'];

      spyOn(windowRef.nativeWindow, 'open');

      locationHelper.openInNewTab(urlSegments);
      expect(windowRef.nativeWindow.open).toHaveBeenCalledWith('/foo/bar');
    });
  });
});
