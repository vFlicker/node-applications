import {
  CdCommand,
  CliApplication,
  ExitCommand,
  HelpCommand,
  LsCommand,
  UpCommand,
} from './cli/index.js';

function main() {
  const cliApplication = new CliApplication();

  cliApplication.registerCommand([
    new HelpCommand(),
    new ExitCommand(),
    new LsCommand(),
    new CdCommand(),
    new UpCommand(),
  ]);

  cliApplication.init(process.argv);
}

main();
