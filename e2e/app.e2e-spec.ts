import { MachinelabsClientPage } from './app.pageObject';
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
