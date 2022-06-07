import {SearchParams, SearchResult, SortDirection} from "../repository-contracts"

describe('Search Unit Tests', () => {

  describe('SearchParams Unit Tests', () => {

    test('page prop', () => {
      const arrange: { page: any, expected: number }[] = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'fake', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      arrange.forEach(item => {
        const { page } = new SearchParams({ page: item.page })
        expect(page).toBe(item.expected)
      })
    })

    test('rows_per_page prop', () => {
      const arrange: { rows_per_page: any, expected: number }[] = [
        { rows_per_page: null, expected: 10 },
        { rows_per_page: undefined, expected: 10 },
        { rows_per_page: '', expected: 10 },
        { rows_per_page: 'fake', expected: 10 },
        { rows_per_page: 0, expected: 10 },
        { rows_per_page: -1, expected: 10 },
        { rows_per_page: 5.5, expected: 10 },
        { rows_per_page: true, expected: 10 },
        { rows_per_page: false, expected: 10 },
        { rows_per_page: {}, expected: 10 },
        { rows_per_page: 10, expected: 10 },
        { rows_per_page: 20, expected: 20 },
      ]

      arrange.forEach(item => {
        const props = new SearchParams({ rows_per_page: item.rows_per_page })
        expect(props.rows_per_page).toBe(item.expected)
      })
    })

    test('sort prop', () => {
      const arrange: { sort: any, expected: string | null }[] = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 'fake', expected: 'fake' }
      ]

      arrange.forEach(item => {
        const props = new SearchParams({ sort: item.sort })
        expect(props.sort).toBe(item.expected)
      })
    })

    test('sort_dir prop', () => {
      const arrange: { sort: any, sort_dir?: any, expected: SortDirection | null }[] = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'field', sort_dir: null, expected: SortDirection.ASC },
        { sort: 'field', sort_dir: undefined, expected: SortDirection.ASC },
        { sort: 'field', sort_dir: '', expected: SortDirection.ASC },
        { sort: 'field', sort_dir: 0, expected: SortDirection.ASC },
        { sort: 'field', sort_dir: 2, expected: SortDirection.ASC },
        { sort: 'field', sort_dir: 'fake', expected: SortDirection.ASC },
        { sort: 'field', sort_dir: SortDirection.ASC, expected: SortDirection.ASC },
        { sort: 'field', sort_dir: 1, expected: SortDirection.DESC },
        { sort: 'field', sort_dir: SortDirection.DESC, expected: SortDirection.DESC },
      ]

      arrange.forEach(item => {
        const data = item.sort_dir ? { sort: item.sort, sort_dir: item. sort_dir } : { sort: item.sort }
        const props = new SearchParams(data)
        expect(props.sort_dir).toBe(item.expected)
      })
    })

    test('filter prop', () => {
      const arrange: { filter: any, expected: string | null }[] = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 'fake', expected: 'fake' }
      ]

      arrange.forEach(item => {
        const props = new SearchParams({ filter: item.filter })
        expect(props.filter).toBe(item.expected)
      })
    })

  })

  describe('SearchResult Unit Tests', () => {

    test('constructor props', () => {
      let result = new SearchResult({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        rows_per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      })
      expect(result.toJSON()).toStrictEqual({
        items: ['entity 1', 'entity 2'],
        total: 4,
        current_page: 1,
        rows_per_page: 2,
        last_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      })

      result = new SearchResult({
        items: ['entity 1', 'entity 2'] as any,
        total: 4,
        current_page: 1,
        rows_per_page: 2,
        sort: 'name',
        sort_dir: SortDirection.ASC,
        filter: 'test'
      })
      expect(result.toJSON()).toStrictEqual({
        items: ['entity 1', 'entity 2'],
        total: 4,
        current_page: 1,
        rows_per_page: 2,
        last_page: 2,
        sort: 'name',
        sort_dir: SortDirection.ASC,
        filter: 'test'
      })
    })

    it('should set last_page = 1 when rows_per_page field is greater than total field', () => {
      const result = new SearchResult({
        items: [],
        total: 4,
        current_page: 1,
        rows_per_page: 15,
        sort: 'name',
        sort_dir: SortDirection.ASC,
        filter: 'test'
      })
      expect(result.last_page).toBe(1)
    })

    test('last_page prop when total is not multiple of rows_per_page', () => {
      const result = new SearchResult({
        items: [],
        total: 101,
        current_page: 1,
        rows_per_page: 20,
        sort: 'name',
        sort_dir: SortDirection.ASC,
        filter: 'test'
      })
      expect(result.last_page).toBe(6)
    })

  })

})