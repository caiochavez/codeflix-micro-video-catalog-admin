import ValidationError from "../errors/validation.error"

export function isEmpty(value: any): boolean {
  return value === undefined || value === null
}

export default class ValidatorRules {

  private constructor(private property: string, private value: any) {}

  static values(property: string, value: any) {
    return new ValidatorRules(property, value)
  }

  required(): Omit<this, 'required'> {
    if (this.value === null || this.value === undefined || this.value === '') {
      throw new ValidationError(`The ${this.property} is required`)
    }
    return this
  }

  string(): Omit<this, 'string'> {
    if (!isEmpty(this.value) && typeof this.value !== 'string') {
      throw new ValidationError(`The ${this.property} must be a string`)
    }
    return this
  }

  maxLength(max: number): Omit<this, 'maxLength'> {
    if (!isEmpty(this.value) && this.value.length > max) {
      throw new ValidationError(`The ${this.property} must be a less or equal than ${max} characters`)
    }
    return this
  }

  boolean(): Omit<this, 'boolean'> {
    if (!isEmpty(this.value) && typeof this.value !== 'boolean') {
      throw new ValidationError(`The ${this.property} must be a boolean`)
    }
    return this
  }

}