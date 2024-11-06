export type ValidatorFieldError = string;

export type ValidatorResponse = {
  field: string;
  errors: ValidatorFieldError[];
}[];
