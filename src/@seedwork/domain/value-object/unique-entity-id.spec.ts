import UniqueEntityId from "./unique-entity-id"
import InvalidUuidError from "../../errors/invalid-uuid.error"
import { randomUUID } from "crypto"

describe('UniqueEntityId Unit Tests', () => {

  const spyValidate = jest.spyOn(UniqueEntityId.prototype as any, 'validate')

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('teste')).toThrowError(InvalidUuidError)
    expect(spyValidate).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const uuid = randomUUID()
    const uniqueEntityId = new UniqueEntityId(uuid)

    expect(uniqueEntityId.id).toBe(uuid)
    expect(spyValidate).toHaveBeenCalled()
  })

  it('should generate a valid uuid in constructor', () => {
    const uniqueEntityId = new UniqueEntityId()
    const regexUUID = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

    expect(uniqueEntityId.id).toMatch(regexUUID)
    expect(spyValidate).toHaveBeenCalled()
  })

})