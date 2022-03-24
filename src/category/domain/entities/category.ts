import UniqueEntityId from "../../../@seedwork/domain/value-object/unique-entity-id"
import Entity from "../../../@seedwork/domain/entity/entity";

export type CategoryProps = {
  name: string
  description?: string
  is_active?: boolean
  created_at?: Date
}

export default class Category extends Entity<CategoryProps> {

  constructor(public readonly props: CategoryProps, id?: UniqueEntityId) {
    super(props, id)
    this.props.description = this.props.description ?? null
    this.props.is_active = this.props.is_active ?? true
    this.props.created_at = this.props.created_at ?? new Date()
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