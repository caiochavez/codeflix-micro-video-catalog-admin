import UniqueEntityId from "../../../@seedwork/domain/value-object/unique-entity-id"
import Entity from "../../../@seedwork/domain/entity/entity"
import ValidatorRules from "../../../@seedwork/validators/validator-rules"

export type CategoryProps = {
  name: string
  description?: string
  is_active?: boolean
  created_at?: Date
}

export default class Category extends Entity<CategoryProps> {

  constructor(public readonly props: CategoryProps, id?: UniqueEntityId) {
    Category.validate(props)
    super(props, id)
    this.props.description = this.props.description ?? null
    this.props.is_active = this.props.is_active ?? true
    this.props.created_at = this.props.created_at ?? new Date()
  }

  public update(name?: string, description?: string) {
    Category.validate({ name, description })
    if (!name && !description) throw Error('No property sent')
    if (name) this.props.name = name
    if (description) this.props.description = description
  }

  static validate (props: Omit<CategoryProps, 'created_at'>) {
    ValidatorRules.values('name', props.name).string()
    ValidatorRules.values('description', props.description).string()
    ValidatorRules.values('is_active', props.is_active).boolean()
  }

  public activate() {
    this.props.is_active = true
  }

  public deactivate () {
    this.props.is_active = false
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get is_active(): boolean {
    return this.props.is_active
  }

  get created_at(): Date {
    return this.props.created_at
  }

}