import {InMemorySearchableRepository} from '../in-memory.repository'
import Entity from '../../entity/entity'
import {SearchParams, SearchResult, SortDirection} from '../repository-contracts'

class StubEntityProps {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected applyFilter(items: StubEntity[], filter: string | null): StubEntity[] {
    if (!filter) return items

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase()) || item.props.price.toString() === filter
    })
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {

  let repository: StubInMemorySearchableRepository

  beforeEach(() => repository = new StubInMemorySearchableRepository())

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', () => {
      const items = [new StubEntity({name: 'entity 1', price: 20})]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const itemsFiltered = repository['applyFilter'](items, null)
      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter param', () => {
      const items = [
        new StubEntity({name: 'test', price: 5}),
        new StubEntity({name: 'TEST', price: 10}),
        new StubEntity({name: 'fake', price: 5})
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      let itemsFiltered = repository['applyFilter'](items, 'TEST')
      expect(itemsFiltered).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalled()

      itemsFiltered = repository['applyFilter'](items, '5')
      expect(itemsFiltered).toStrictEqual([items[0], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      itemsFiltered = repository['applyFilter'](items, 'no-filter')
      expect(itemsFiltered).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort method', () => {
    it('should no sort items', () => {
      const items = [
        new StubEntity({name: 'a', price: 5}),
        new StubEntity({name: 'b', price: 5})
      ]
      let itemsSorted = repository['applySort'](items, null, null)
      expect(itemsSorted).toStrictEqual(items)

      itemsSorted = repository['applySort'](items, 'price', SortDirection.ASC)
      expect(itemsSorted).toStrictEqual(items)
    })

    it('should sort items', () => {
      const items = [
        new StubEntity({name: 'c', price: 5}),
        new StubEntity({name: 'a', price: 5}),
        new StubEntity({name: 'b', price: 5})
      ]
      let itemsSorted = repository['applySort'](items, 'name', SortDirection.ASC)
      expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]])

      itemsSorted = repository['applySort'](items, 'name', SortDirection.DESC)
      expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]])
    })
  })

  describe('applyPagination method', () => {
    it('should paginate items', () => {
      const items = [
        new StubEntity({name: 'a', price: 5}),
        new StubEntity({name: 'b', price: 5}),
        new StubEntity({name: 'c', price: 5}),
        new StubEntity({name: 'd', price: 5}),
        new StubEntity({name: 'e', price: 5})
      ]

      let itemsSorted = repository['applyPagination'](items, 1, 2)
      expect(itemsSorted).toStrictEqual([items[0], items[1]])

      itemsSorted = repository['applyPagination'](items, 2, 2)
      expect(itemsSorted).toStrictEqual([items[2], items[3]])

      itemsSorted = repository['applyPagination'](items, 3, 2)
      expect(itemsSorted).toStrictEqual([items[4]])

      itemsSorted = repository['applyPagination'](items, 4, 2)
      expect(itemsSorted).toStrictEqual([])
    })
  })

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 })
      const items = Array(16).fill(entity)

      repository.items = items
      const itemsSearched = await repository.search(new SearchParams({}))

      expect(itemsSearched).toStrictEqual(new SearchResult({
        items: Array(10).fill(entity),
        total: 16,
        current_page: 1,
        rows_per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null
      }))
    })

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({name: 'test', price: 5}),
        new StubEntity({name: 'TeSt', price: 10}),
        new StubEntity({name: 'TESTE', price: 5})
      ]
      repository.items = items

      let result = await repository.search(new SearchParams({
        filter: 'TEST',
        page: 1,
        rows_per_page: 2
      }))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[1]],
        total: 3,
        current_page: 1,
        rows_per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST'
      }))

      result = await repository.search(new SearchParams({
        filter: 'TEST',
        page: 2,
        rows_per_page: 2
      }))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[2]],
        total: 3,
        current_page: 2,
        rows_per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'TEST'
      }))
    })

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({name: 'b', price: 5}),
        new StubEntity({name: 'a', price: 10}),
        new StubEntity({name: 'd', price: 5}),
        new StubEntity({name: 'c', price: 5})
      ]
      repository.items = items

      const arrange = [
        {
          params: new SearchParams({ sort: 'name', page: 1, rows_per_page: 2 }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 4,
            current_page: 1,
            rows_per_page: 2,
            sort: 'name',
            sort_dir: SortDirection.ASC,
            filter: null
          })
        },
        {
          params: new SearchParams({ sort: 'name', page: 2, rows_per_page: 2 }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 4,
            current_page: 2,
            rows_per_page: 2,
            sort: 'name',
            sort_dir: SortDirection.ASC,
            filter: null
          })
        },
        {
          params: new SearchParams({ sort: 'name', sort_dir: SortDirection.DESC, page: 1, rows_per_page: 5 }),
          result: new SearchResult({
            items: [items[2], items[3], items[0], items[1]],
            total: 4,
            current_page: 1,
            rows_per_page: 5,
            sort: 'name',
            sort_dir: SortDirection.DESC,
            filter: null
          })
        }
      ]

      for (const item of arrange) {
        const result = await repository.search(item.params)
        expect(result).toStrictEqual(item.result)
      }
    })

    it('should apply paginate, sort and filter', async () => {
      const items = [
        new StubEntity({name: 'teste', price: 5}),
        new StubEntity({name: 'a', price: 10}),
        new StubEntity({name: 'TeSte', price: 10}),
        new StubEntity({name: 'b', price: 10}),
        new StubEntity({name: 'TESTe', price: 5})
      ]
      repository.items = items

      const arrange = [
        {
          params: new SearchParams({ sort: 'name', page: 1, rows_per_page: 2, filter: 'TEST' }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 3,
            current_page: 1,
            rows_per_page: 2,
            sort: 'name',
            sort_dir: SortDirection.ASC,
            filter: 'TEST'
          })
        },
        {
          params: new SearchParams({ sort: 'name', page: 2, rows_per_page: 2, filter: 'TEST' }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            rows_per_page: 2,
            sort: 'name',
            sort_dir: SortDirection.ASC,
            filter: 'TEST'
          })
        },
      ]

      for (const item of arrange) {
        const result = await repository.search(item.params)
        expect(result).toStrictEqual(item.result)
      }
    })
  })

})