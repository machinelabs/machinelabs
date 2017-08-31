import { loginServer } from '../lib/login-server';

const hasArgsForLogin = (argv) => argv.cfg.server.name && argv.cfg.server.zone && argv.cfg.googleProjectId;

const login = (argv) => {
  if (hasArgsForLogin(argv)) {
    loginServer(argv.cfg.googleProjectId, argv.cfg.server.zone, argv.cfg.server.name);
  }
}

const check = argv => {
  if (argv._.includes('login') && !hasArgsForLogin(argv)) {
    throw new Error('Command needs `cfg.server.name`, `cfg.server.zone` and `cfg.googleProjectId`');
  }
}

export const loginCommand = {
  run: login,
  check: check
};

