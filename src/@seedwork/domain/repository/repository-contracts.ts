import Entity from "../entity/entity"
import UniqueEntityId from "../value-object/unique-entity-id"

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>
  findById(id: string | UniqueEntityId): Promise<E>
  findAll(): Promise<E[]>
  update(entity: E): Promise<void>
  delete(id: string | UniqueEntityId): Promise<void>
}

export enum SortDirection {
  ASC = 0,
  DESC = 1
}

export type SearchProps<Filter = string> = {
  page?: number
  rows_per_page?: number
  sort?: string | null
  sort_dir?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams {
  private _page: number
  private _rows_per_page: number = 10
  private _sort: string | null
  private _sort_dir: SortDirection | null
  private _filter: string | null

  constructor(props: SearchProps) {
    this.page = props.page
    this.rows_per_page = props.rows_per_page
    this.sort = props.sort
    this.sort_dir = props.sort_dir
    this.filter = props.filter
  }

  get page(): number {
    return this._page
  }

  private set page(value: number) {
    const _page = +value
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) this._page = 1
    else this._page = _page
  }

  get rows_per_page(): number {
    return this._rows_per_page
  }

  private set rows_per_page(value: number) {
    const _rows_per_page = value === true as any ? this.rows_per_page : +value
    if (Number.isNaN(_rows_per_page) || _rows_per_page <= 0 || parseInt(_rows_per_page as any) !== _rows_per_page) {
      this._rows_per_page = this.rows_per_page
    }
    else this._rows_per_page = _rows_per_page
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    if (value === null || value === undefined || value === '') this._sort = null
    else this._sort = `${value}`
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir
  }

  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null
      return
    }
    this._sort_dir = value !== SortDirection.ASC && value !== SortDirection.DESC
      ? SortDirection.ASC
      : value
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(value: string | null) {
    if (value === null || value === undefined || value === '') this._filter = null
    else this._filter = `${value}`
  }
}

type SearchResultProps<E extends Entity, Filter> = {
  items: E[]
  total: number
  current_page: number
  rows_per_page: number
  sort: string | null
  sort_dir: SortDirection | null
  filter: Filter | null
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[]
  readonly total: number
  readonly current_page: number
  readonly rows_per_page: number
  readonly last_page: number
  readonly sort: string | null
  readonly sort_dir: SortDirection | null
  readonly filter: Filter | null

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items
    this.total = props.total
    this.current_page = props.current_page
    this.rows_per_page = props.rows_per_page
    this.last_page = Math.ceil(props.total / props.rows_per_page)
    this.sort = props.sort
    this.sort_dir = props.sort_dir
    this.filter = props.filter
  }

  toJSON () {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      rows_per_page: this.rows_per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter
    }
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>
> extends RepositoryInterface<E> {
  sortableFields: string[]
  search(props: SearchInput): Promise<SearchOutput>
}