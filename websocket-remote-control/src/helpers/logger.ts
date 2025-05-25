const enum Color {
  Red = 31,
  Green = 32,
  Blue = 34,
}

const enum LogLevel {
  Success = 'success',
  Info = 'info',
  Error = 'error',
}

const getColoredText = (text: string, color: Color): string => {
  return `\x1B[${color}m${text}\x1B[0m`;
};

export const log = (message: string, flag?: `${LogLevel}`): void => {
  switch (flag) {
    case LogLevel.Success:
      console.log(getColoredText(message, Color.Green));
      break;
    case LogLevel.Info:
      console.log(getColoredText(message, Color.Blue));
      break;
    case LogLevel.Error:
      console.log(getColoredText(message, Color.Red));
      break;
    default:
      console.log(message);
      break;
  }
};
