import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { LocationHelper } from './location-helper';

describe('LocationHelper', () => {

  let locationHelper: LocationHelper;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LocationHelper]
    });

    locationHelper = TestBed.get(LocationHelper);
    location = TestBed.get(Location);
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
});
