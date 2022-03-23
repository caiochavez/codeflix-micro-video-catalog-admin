import Category, {CategoryProps} from "./category"
import { omit } from "lodash"
import UniqueEntityId from "../../../@seedwork/domain/value-object/unique-entity-id"

describe('Category Tests', () => {

  it("should start constructor of category", () => {
    let props: CategoryProps = { name: 'Filme' }
    let category = new Category(props)
    props.id = category.id

    expect(category.props).toStrictEqual(props)
    expect(category.props.created_at).toBeInstanceOf(Date)

    props = {
      name: 'Filme',
      description: 'Alguma coisa',
      is_active: false,
      created_at: new Date()
    }
    category = new Category(props)
    props.id = category.id
    expect(category.props).toStrictEqual(props)

    props = omit(category.props, ['created_at', 'description', 'is_active'])
    expect(props).toStrictEqual({ id: category.id, name: 'Filme' })
  })

  it('id field', () => {
    type CategoryData = { props: CategoryProps }[]
    const data: CategoryData = [
      { props: { name: 'Filme' } },
      { props: { id: null, name: 'Filme' } },
      { props: { id: undefined, name: 'Filme' } }
    ]

    data.forEach(item => {
      const category = new Category(item.props)
      expect(category.id).not.toBeNull()
      expect(category.id).toBeInstanceOf(UniqueEntityId)
    })
  })

  it('should get name of category', () => {
    const category = new Category({ name: 'Filme' })
    expect(category.name).toBe('Filme')
  })

  it('should get description of category', () => {
    let category = new Category({ name: 'Filme', description: 'Alguma coisa' })
    expect(category.description).toBe('Alguma coisa')

    category = new Category({ name: 'Filme', description: undefined })
    expect(category.description).toBeNull()

    category = new Category({ name: 'Filme' })
    expect(category.description).toBeNull()
  })

  it('should get is_active of category', () => {
    let category = new Category({ name: 'Filme', is_active: true })
    expect(category.is_active).toBeTruthy()

    category = new Category({ name: 'Filme', is_active: false })
    expect(category.is_active).toBeFalsy()

    category = new Category({ name: 'Filme' })
    expect(category.is_active).toBeTruthy()
  })

  it('should get created_at of category', () => {
    const date = new Date()
    let category = new Category({ name: 'Filme', created_at: date })
    expect(category.created_at).toBe(date)

    category = new Category({ name: 'Filme' })
    expect(category.created_at).toBeInstanceOf(Date)
  })

})