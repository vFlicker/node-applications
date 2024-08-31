import { ColorPrinter } from '#src/shared/libs/ColorPrinter/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class HelpCommand extends AbstractCommand {
  getName() {
    return 'help';
  }

  async execute() {
    ColorPrinter.green(`
      This is file manager CLI.

      Available commands categories:
        Common:
          - .exit                                              exit from CLI
          - help                                               print help
        Navigation:
          - up                                                 go to parent directory
          - cd <path_to_directory>                             go to directory
          - ls                                                 list directory content
        File system:
          - add <new_file_name>                                create empty file in current directory
          - cat <path_to_file>                                 print file content
          - cp <path_to_file> <path_to_directory>              copy file
          - mv <path_to_file> <path_to_directory>              move file
          - rm <path_to_file>                                  remove file
          - rn <path_to_file> <path_to_new_filename>           rename file
        Hash:
          - hash                                               print hash of current directory
        OS:
          - os --EOL                                           print EOL
          - os --cpus                                          print number of CPUs
          - os --homedir                                       print home directory
          - os --username                                      print system username
          - os --architecture                                  print system architecture
        Compress:
          - compress <path_to_file> <path_to_destination>      compress file
          - decompress <path_to_file> <path_to_destination>    decompress file
    `);
  }
}
