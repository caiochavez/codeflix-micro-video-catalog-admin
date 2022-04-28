import {RepositoryInterface} from "./repository-contracts"
import Entity from "../entity/entity"
import UniqueEntityId from "../value-object/unique-entity-id"
import NotFoundError from "../errors/not-found.error";

export default abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    return this._get(`${id}`)
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)
    const indexFound = this.items.findIndex(item => item.id === entity.id)
    this.items[indexFound] = entity
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    await this._get(`${id}`)
    const indexFound = this.items.findIndex(item => item.id === id)
    this.items.splice(indexFound, 1)
  }

  protected async _get(id: string): Promise<E> {
    const itemFound = this.items.find(item => item.id === id)
    if (!itemFound) throw new NotFoundError(`Entity not found using ID: ${id}`)
    return itemFound
  }

}