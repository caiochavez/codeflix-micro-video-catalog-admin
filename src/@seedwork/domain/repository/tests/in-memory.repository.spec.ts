import Entity from "../../entity/entity"
import { InMemoryRepository } from "../in-memory.repository"
import NotFoundError from "../../errors/not-found.error"
import UniqueEntityId from "../../value-object/unique-entity-id"
import {randomUUID} from "crypto"

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository Unit Tests", () => {

  let repository: StubInMemoryRepository
  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  it('should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })
    await repository.insert(entity)
    expect(repository.items[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throws error when entity not found', () => {
    expect(repository.findById('fake_id')).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID: fake_id`)
    )

    const uuid = randomUUID()
    expect(repository.findById(new UniqueEntityId(uuid))).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID: ${uuid}`)
    )
  })

  it('should finds a entity by id', async () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })
    await repository.insert(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON())

    entityFound = await repository.findById(entity.uniqueEntityId)
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })
    await repository.insert(entity)

    const entities = await repository.findAll()
    expect(entities).toStrictEqual([entity])
  })

  it('should throws error on update when entity not found', () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })
    expect(repository.update(entity)).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID: ${entity.id}`)
    )
  })

  it('should updates an entity', async () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })
    await repository.insert(entity)

    const entityUpdated = new StubEntity({ name: 'updated', price: 1 }, entity.uniqueEntityId)
    await repository.update(entityUpdated)
    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  it('should throws error on delete when entity not found', () => {
    expect(repository.delete('fake_id')).rejects.toThrowError(
      new NotFoundError('Entity not found using ID: fake_id')
    )

    const uuid = randomUUID()
    expect(repository.delete(new UniqueEntityId(uuid))).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID: ${uuid}`)
    )
  })

  it('should deletes an entity', async () => {
    const entity = new StubEntity({ name: 'teste', price: 10 })

    await repository.insert(entity)
    await repository.delete(entity.id)
    expect(repository.items).toHaveLength(0)

    await repository.insert(entity)
    await repository.delete(entity.uniqueEntityId)
    expect(repository.items).toHaveLength(0)
  })

})