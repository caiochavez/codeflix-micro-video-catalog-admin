import UniqueEntityId from "../../../@seedwork/domain/value-object/unique-entity-id"

export type CategoryProps = {
  id?: UniqueEntityId
  name: string
  description?: string
  is_active?: boolean
  created_at?: Date
}

export default class Category {

  constructor(public readonly props: CategoryProps) {
    this.id = this.props.id || new UniqueEntityId()
    this.name = this.props.name
    this.description = this.props.description ?? null
    this.is_active = this.props.is_active ?? true
    this.created_at = this.props.created_at ?? new Date()
  }

  get id(): UniqueEntityId {
    return this.props.id
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

  private set id(id: UniqueEntityId) {
    this.props.id = id
  }

  private set name(name: string) {
    this.props.name = name
  }

  private set description(description: string) {
    this.props.description = description
  }

  private set is_active(is_active: boolean) {
    this.props.is_active = is_active
  }

  private set created_at(created_at: Date) {
    this.props.created_at = created_at
  }

}

/*

Category : create()
Category : update()
Category : activate()
Category : deactivate()
Category : delete()
*/
