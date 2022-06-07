import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection
} from "./repository-contracts"
import Entity from "../entity/entity"
import UniqueEntityId from "../value-object/unique-entity-id"
import NotFoundError from "../errors/not-found.error"

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
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

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E> {

  sortableFields: string[] = []

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = this.applyFilter(this.items, props.filter)
    const itemsSorted = this.applySort(itemsFiltered, props.sort, props.sort_dir)
    const itemsPaginated = this.applyPagination(itemsSorted, props.page, props.rows_per_page)

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      rows_per_page: props.rows_per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter
    })
  }

  protected abstract applyFilter(items: E[], filter: string | null): E[]

  protected applySort(items: E[], sort: string | null, sort_dir: SortDirection | null): E[] {
    if (!sort || !this.sortableFields.includes(sort)) return items

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === SortDirection.ASC ? -1 : 1
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === SortDirection.ASC ? 1 : -1
      }

      return 0
    })
  }

  protected applyPagination(items: E[], page: SearchParams['page'], rows_per_page: SearchParams['rows_per_page']): E[] {
    const start = (page - 1) * rows_per_page
    const end = start + rows_per_page
    return items.slice(start, end)
  }

}