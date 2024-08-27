import {
  CdCommand,
  CliApplication,
  ExitCommand,
  HelpCommand,
  LsCommand,
} from './cli/index.js';

function main() {
  const cliApplication = new CliApplication();

  cliApplication.registerCommand([
    new HelpCommand(),
    new ExitCommand(),
    new LsCommand(),
    new CdCommand(),
  ]);

  cliApplication.init(process.argv);
}

main();
