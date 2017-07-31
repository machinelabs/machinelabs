export class AbstractValidationError {
  constructor(public message: string) {}
}

export type ValidationResult = boolean | AbstractValidationError;
