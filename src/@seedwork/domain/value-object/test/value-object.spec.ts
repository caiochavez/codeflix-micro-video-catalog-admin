import ValueObject from "../value-object"

describe('ValueObject Unit Test', () => {

  class StubValueObject extends ValueObject {}

  it('should set value', () => {
    let valueObject = new StubValueObject('algo')
    expect(valueObject.value).toBe('algo')

    valueObject = new StubValueObject({ prop: 'algo' })
    expect(valueObject.value).toStrictEqual({ prop: 'algo' })
  })

  it('should convert to a string', () => {
    const date = new Date()
    const arrange: any[] = [
      { received: null, expected: 'null' },
      { received: undefined, expected: 'undefined' },
      { received: '', expected: '' },
      { received: 'fake', expected: 'fake' },
      { received: 0, expected: '0' },
      { received: 5, expected: '5' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: date, expected: date.toString() },
      { received: { prop: 'algo' }, expected: JSON.stringify({ prop: 'algo' }) },
    ]

    arrange.forEach(value => {
      const valueObject = new StubValueObject(value.received)
      expect(valueObject.toString()).toBe(value.expected)
    })
  })

  it('should be a immutable object', () => {
    const valueObject = new StubValueObject({
      prop1: 'value1',
      deep: { prop2: 'value2', prop3: new Date() },
    })

    expect(() => (valueObject.value as any).prop1 = '1')
      .toThrowError("Cannot assign to read only property 'prop1' of object '#<Object>")

    expect(() => (valueObject.value as any).deep.prop2 = '2')
      .toThrowError("Cannot assign to read only property 'prop2' of object '#<Object>'")

    expect(valueObject.value.deep.prop3).toBeInstanceOf(Date)
  })

})