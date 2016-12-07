import { MachinelabsClientPage } from './app.po';

describe('machinelabs-client App', function() {
  let page: MachinelabsClientPage;

  beforeEach(() => {
    page = new MachinelabsClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
