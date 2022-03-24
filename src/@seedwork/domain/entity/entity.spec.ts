import Entity from "./entity"
import UniqueEntityId from "../value-object/unique-entity-id"

class StubEntity extends Entity<{ prop1: string, prop2: number }> {}

describe('entity Unit Tests', () => {

  it('should set props and id', () => {
    const arrange = { prop1: '1', prop2: 2 }
    const stubEntity = new StubEntity(arrange)

    expect(stubEntity.props).toStrictEqual(arrange)
    expect(stubEntity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(stubEntity.id).not.toBeNull()

    const regexUUID = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    expect(stubEntity.id).toMatch(regexUUID)
  })

  it('should accept a valid uuid', () => {
    const arrange = { prop1: '1', prop2: 2 }
    const uniqueEntityId = new UniqueEntityId()
    const stubEntity = new StubEntity(arrange, uniqueEntityId)

    expect(stubEntity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(stubEntity.id).toBe(uniqueEntityId.value)
  })

  it('should convert a entity to JSON', () => {
    const arrange = { prop1: '1', prop2: 2 }
    const uniqueEntityId = new UniqueEntityId()
    const stubEntity = new StubEntity(arrange, uniqueEntityId)

    expect(stubEntity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      ...arrange
    })
  })

})