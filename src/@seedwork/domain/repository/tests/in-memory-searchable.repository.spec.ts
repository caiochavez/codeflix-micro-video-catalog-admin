import {InMemorySearchableRepository} from '../in-memory.repository'
import Entity from '../../entity/entity'
import {SortDirection} from '../repository-contracts'

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

  describe('search method', () => {})

})