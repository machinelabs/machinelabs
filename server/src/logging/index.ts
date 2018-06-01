import * as l4js from 'log4js';
import { Config } from '../util/config';
import { environment } from '../environments/environment';

// We have to use `any` here because the type definitions are out
// of sync with the project.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18492
export const log4js: any = l4js;

const slackToken = Config.tryGetEnv(Config.ENV_SLACK_TOKEN);

const config = {
  appenders: {
    stdout: { type: 'stdout' }
  },
  categories: {
    default: { appenders: ['stdout'], level: log4js.levels.ALL }
  }
};

if (!slackToken) {
  // We want that entry to be written *after* logging is configured. Hence the timeout
  setTimeout(() => console.log('No slack logging enabled. Set env MACHINELABS_SLACK_TOKEN to enable'), 0);
} else {
  config.appenders['slack-all'] = {
    type: 'slack',
    token: slackToken,
    channel_id: environment.slackLogging ? environment.slackLogging.allChannel : '',
    username: 'ml-bot'
  };

  config.appenders['slack-errors'] = {
    type: 'slack',
    token: slackToken,
    channel_id: environment.slackLogging ? environment.slackLogging.errorChannel : '',
    username: 'ml-bot'
  };

  // This filters all errors and forwards them to the slack-errors appender
  config.appenders['errors'] = { type: 'logLevelFilter', appender: 'slack-errors', level: 'error' };

  config.categories.default.appenders.push('slack-all', 'errors');
}

log4js.configure(config);

export const logger: any = log4js.getLogger();

// We are offering a method to replace all console methods to avoid
// coupling each and every file against the logger
export const replaceConsole = () => {
  console.log = logger.info.bind(logger);
  console.error = logger.error.bind(logger);
  console.debug = logger.debug.bind(logger);
  console.info = logger.info.bind(logger);
  console.warn = logger.warn.bind(logger);
  console.trace = logger.trace.bind(logger);
};
