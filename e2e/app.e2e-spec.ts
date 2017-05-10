import { MachinelabsClientPage } from './app.page-object';
import { browser } from 'protractor';

describe('machinelabs-client App', function() {
  let page: MachinelabsClientPage;

  beforeEach(() => {
    page = new MachinelabsClientPage();
  });

  it('should work', () => {
    browser.get('/');
  });
});
