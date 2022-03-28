import ClassValidatorFields from "../class-validator-fields"
import * as classValidatorLib from 'class-validator'

describe('ClassValidatorFields Unit Tests', () => {

  class StubClassValidatorFields extends ClassValidatorFields<{ field: string }> {}

  it('should initialize errors and validatedData with null', () => {
    const stubClassValidatorFields = new StubClassValidatorFields()
    expect(stubClassValidatorFields.errors).toBeNull()
    expect(stubClassValidatorFields.validatedData).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, 'validateSync')
    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: { Required: 'some error' },
      }
    ])
    const stubClassValidatorFields = new StubClassValidatorFields()
    expect(stubClassValidatorFields.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(stubClassValidatorFields.validatedData).toBeNull()
    expect(stubClassValidatorFields.errors).toStrictEqual({ field: ['some error'] })
  })

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, 'validateSync').mockReturnValue([])
    const stubClassValidatorFields = new StubClassValidatorFields()
    expect(stubClassValidatorFields.validate({ field: 'some' })).toBeTruthy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(stubClassValidatorFields.validatedData).toStrictEqual({ field: 'some' })
    expect(stubClassValidatorFields.errors).toBeNull()
  })

})