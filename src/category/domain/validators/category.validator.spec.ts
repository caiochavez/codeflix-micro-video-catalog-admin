import CategoryValidatorFactory, {CategoryRules, CategoryValidator} from "./category.validator"
import {CategoryProps} from "../entities/category"

describe('CategoryValidator Tests', () => {

  let validator: CategoryValidator

  beforeEach(() => {
    validator = CategoryValidatorFactory.create()
  })

  test('invalidation cases to name field', () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { name: '' } }).containsErrorMessages({
      name: ['name should not be empty']
    })

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { name: 'some'.repeat(256) } }).containsErrorMessages({
      name: ['name must be shorter than or equal to 255 characters']
    })
  })

  test('invalidation cases to description field', () => {
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ['description must be a string']
    })
  })

  test('invalidation cases to is_active field', () => {
    expect({ validator, data: { is_active: 5 } }).containsErrorMessages({
      is_active: ['is_active must be a boolean value']
    })
    expect({ validator, data: { is_active: 0 } }).containsErrorMessages({
      is_active: ['is_active must be a boolean value']
    })
  })

  test('valid cases for fields', () => {
    const arrange: CategoryProps[] = [
      { name: 'some' },
      { name: 'some', description: undefined },
      { name: 'some', description: null },
      { name: 'some', is_active: true },
      { name: 'some', is_active: false }
    ]
    arrange.forEach(item => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
    })
  })

})