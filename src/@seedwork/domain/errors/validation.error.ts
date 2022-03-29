import {FieldErrors} from "../validators/validator-fields.interface"

export class ValidationError extends Error {

  constructor(message?: string) {
    super(message || 'Invalid property')
    this.name = 'ValidationError'
  }

}

export class EntityValidationError extends Error {
  constructor(public error: FieldErrors) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}