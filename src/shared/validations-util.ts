import { ValidationError } from '../domain/errors/validation-error'

export const isMinOrFail = (min: number, value: number, message: string): void => {
  if (value < min) {
    throw new ValidationError(message)
  }
}

export const isPositiveOrFail = (value: any, message: string): void => {
  if (value <= 0) {
    throw new ValidationError(message)
  }
}

export const isIntegerOrFail = (value: any, message: string): void => {
  if (!Number.isInteger(value)) {
    throw new ValidationError(message)
  }
}

export const isArrayOrFail = (value: any, message: string): void => {
  if (!Array.isArray(value)) {
    throw new ValidationError(message)
  }
}

export const isNotEmptyOrFail = (value: any, message: string): void => {
  if (!value) {
    throw new ValidationError(message)
  }
}
