import ClassValidatorFields from "../validators/class-validator-fields"
import {FieldErrors} from "../validators/validator-fields.interface"
import { objectContaining } from 'expect'
import {EntityValidationError} from "../errors/validation.error"

type Expect = { validator: ClassValidatorFields<any>, data: any } | (() => any)

expect.extend({
  containsErrorMessages(expect: Expect, received: FieldErrors) {
    if (typeof expect === 'function') {
      try {
        expect()
        return isValid()
      } catch (err) {
        const entityValidationError = err as EntityValidationError
        return assertContainsErrors(entityValidationError.error, received)
      }
    } else {
      const { validator, data } = expect
      const validated = validator.validate(data)

      if (validated) return isValid()

      return assertContainsErrors(validator.errors, received)
    }
  }
})

function isValid() {
  return { pass: false, message: () => 'The data is valid' }
}

function assertContainsErrors(current: FieldErrors, received: FieldErrors) {
  const isMatch = objectContaining(received).asymmetricMatch(current)
  return isMatch
    ? { pass: true, message: () => '' }
    : {
      pass: false,
      message: () => `The validation errors not contains ${JSON.stringify(received)}.
          Current: ${JSON.stringify(current)}`
    }
}