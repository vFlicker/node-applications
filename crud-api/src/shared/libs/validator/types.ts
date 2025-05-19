export type ValidatorFieldError = string;

export type ValidatorResponse = {
  field: string;
  messages: ValidatorFieldError[];
}[];
