import ValidatorRules from "../validator-rules"
import ValidationError from "../../errors/validation.error"

describe('ValidatorRules Unit Tests', () => {

  type ArrangeItem = {
    property: string
    value: any
  }

  type AssertProperties = {
    rule: keyof ValidatorRules
    error: ValidationError
    params?: any []
  } & ArrangeItem

  function runRule({ property, value, rule, params = [] }: Omit<AssertProperties, 'error'>) {
    const validator = ValidatorRules.values(property, value)
    const method = validator[rule]
    // @ts-ignore
    method.apply(validator, params)
  }

  function assertIsValid(assertProperties: AssertProperties) {
    expect(() => runRule(assertProperties)).not.toThrowError(assertProperties.error)
  }

  function assertIsInvalid(assertProperties: AssertProperties) {
    expect(() => runRule(assertProperties)).toThrowError(assertProperties.error)
  }

  test('values method', () => {
    const validatorRules = ValidatorRules.values('field', 'some value')
    expect(validatorRules).toBeInstanceOf(ValidatorRules)
    expect(validatorRules['property']).toBe('field')
    expect(validatorRules['value']).toBe('some value')
  })

  test('required validation rule', () => {
    let arrange: ArrangeItem[] = [
      { property: 'field', value: null },
      { property: 'field', value: undefined },
      { property: 'field', value: '' }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsInvalid({
        property: item.property,
        value: item.value,
        rule: 'required',
        error: new ValidationError('The field is required')
      })
    })

    arrange = [
      { property: 'field', value: 'some' },
      { property: 'field', value: 0 },
      { property: 'field', value: 11 },
      { property: 'field', value: false },
      { property: 'field', value: true }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsValid({
        property: item.property,
        value: item.value,
        rule: 'required',
        error: new ValidationError('The field is required')
      })
    })
  })

  test('string validation rule', () => {
    let arrange: ArrangeItem[] = [
      { property: 'field', value: 5 },
      { property: 'field', value: {} },
      { property: 'field', value: false }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsInvalid({
        property: item.property,
        value: item.value,
        rule: 'string',
        error: new ValidationError('The field must be a string')
      })
    })

    arrange = [
      { property: 'field', value: 'some' },
      { property: 'field', value: undefined },
      { property: 'field', value: null }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsValid({
        property: item.property,
        value: item.value,
        rule: 'string',
        error: new ValidationError('The field must be a string')
      })
    })
  })

  test('maxLength validation rule', () => {
    let arrange: ArrangeItem[] = [
      { property: 'field', value: 'aaaaa' },
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsInvalid({
        property: item.property,
        value: item.value,
        rule: 'maxLength',
        error: new ValidationError('The field must be a less or equal than 4 characters'),
        params: [4]
      })
    })

    arrange = [
      { property: 'field', value: 'aaaaa' },
      { property: 'field', value: 'aaaa' },
      { property: 'field', value: undefined },
      { property: 'field', value: null }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsValid({
        property: item.property,
        value: item.value,
        rule: 'maxLength',
        error: new ValidationError('The field must be a less or equal than 5 characters'),
        params: [5]
      })
    })
  })

  test('boolean validation rule', () => {
    let arrange: ArrangeItem[] = [
      { property: 'field', value: 5 },
      { property: 'field', value: {} },
      { property: 'field', value: 'true' }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsInvalid({
        property: item.property,
        value: item.value,
        rule: 'boolean',
        error: new ValidationError('The field must be a boolean')
      })
    })

    arrange = [
      { property: 'field', value: true },
      { property: 'field', value: false },
      { property: 'field', value: undefined },
      { property: 'field', value: null }
    ]
    arrange.forEach((item: ArrangeItem) => {
      assertIsValid({
        property: item.property,
        value: item.value,
        rule: 'boolean',
        error: new ValidationError('The field must be a boolean')
      })
    })
  })

  it('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values('field', null)
    expect(() => validator.required().string())
      .toThrow(new ValidationError('The field is required'))

    validator = ValidatorRules.values('field', 5)
    expect(() => validator.required().string().maxLength(5))
      .toThrow(new ValidationError('The field must be a string'))

    validator = ValidatorRules.values('field', 'aaaaaa')
    expect(() => validator.required().string().maxLength(5))
      .toThrow(new ValidationError('The field must be a less or equal than 5 characters'))

    validator = ValidatorRules.values('field', null)
    expect(() => validator.required().boolean())
      .toThrow(new ValidationError('The field is required'))

    validator = ValidatorRules.values('field', 5)
    expect(() => validator.required().boolean())
      .toThrow(new ValidationError('The field must be a boolean'))
  })

  it('should valid when combine two or more validation rules', () => {
    expect.assertions(0)
    ValidatorRules.values('field', 'test').required().string()
    ValidatorRules.values('field', 'aaaaa').required().string().maxLength(5)
    ValidatorRules.values('field', true).required().boolean()
    ValidatorRules.values('field', false).required().boolean()
  })

})