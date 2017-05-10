import { browser, element, by } from 'protractor';

/**
 * Due to some know issues with Firebase and Protractor (see [1])
 * Protractor times out with the "Timed out waiting for asynchronous Angular tasks
 * to finish after 11 seconds." error (see [2]).
 *
 * For Angular apps, Protractor will wait until the Angular Zone stabilizes.
 * This means long running async operations will block your test from continuing.
 *
 * Since in this particular case, the problem lies in the interaction between
 * Firebase and Protractor, which we have no control over, the workaround is to
 * disable synchronization for Protractor (see protractor.conf.js -> onPrepare)
 * and make sure we only execute the tests once the app stabilized and the content
 * is ready
 *
 * This function does exactly that. It forces the browser to wait until the content
 * of the app at a given route is available.
 *
 *
 * [1] - https://github.com/angular/angularfire2/issues/779#issuecomment-287030633
 * [2] - https://github.com/angular/protractor/blob/master/docs/timeouts.md
 */
export function waitForContentReady() {
    browser.wait(() => element.all(by.css('ml-app > div > *')).count().then(count => count > 1));
  }


