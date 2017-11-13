export interface ValidationError {
  message: string;
}

export type ValidationResult = boolean | ValidationError;
