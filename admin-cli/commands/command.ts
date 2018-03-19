export interface Command {
  check(argv): void;
  run(argv): void;
}
