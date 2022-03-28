import ClassValidatorFields from "../validators/class-validator-fields"
import {FieldErrors} from "../validators/validator-fields.interface"
import { objectContaining } from 'expect'

type Expect = { validator: ClassValidatorFields<any>, data: any }

expect.extend({
  containsErrorMessages(expect: Expect, received: FieldErrors) {
    const { validator, data } = expect
    const isValid = validator.validate(data)

    if (isValid) return { pass: false, message: () => 'The datta is valid' }

    const isMatch = objectContaining(received).asymmetricMatch(validator.errors)
    return isMatch
      ? { pass: true, message: () => '' }
      : {
          pass: false,
          message: () => `The validation errors not contains ${JSON.stringify(received)}.
          Current: ${JSON.stringify(validator.errors)}`
        }
  }
})