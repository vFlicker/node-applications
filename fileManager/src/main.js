import {
  AddCommand,
  CatCommand,
  CdCommand,
  CliApplication,
  CompressCommand,
  CpCommand,
  DecompressCommand,
  ExitCommand,
  HashCommand,
  HelpCommand,
  LsCommand,
  MvCommand,
  OsCommand,
  RmCommand,
  RnCommand,
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
    new AddCommand(),
    new CatCommand(),
    new RnCommand(),
    new CpCommand(),
    new RmCommand(),
    new MvCommand(),
    new HashCommand(),
    new CompressCommand(),
    new DecompressCommand(),
    new OsCommand(),
  ]);

  cliApplication.init(process.argv);
}

main();
