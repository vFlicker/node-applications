export class HttpError extends Error {
  public httpStatusCode: number;
  public context?: string;

  constructor(httpStatusCode: number, message: string) {
    super(message);

    this.httpStatusCode = httpStatusCode;
  }
}
