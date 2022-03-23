import { randomUUID } from 'crypto'

export type CategoryProps = {
  id?: string
  name: string
  description?: string
  is_active?: boolean
  created_at?: Date
}

export default class Category {

  constructor(public readonly props: CategoryProps) {
    this.id = props.id || randomUUID()
    this.name = this.props.name
    this.description = this.props.description ?? null
    this.is_active = this.props.is_active ?? true
    this.created_at = this.props.created_at ?? new Date()
  }

  get id(): string {
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

  set id(id: string) {
    this.props.id = id
  }

  set name(name: string) {
    this.props.name = name
  }

  set description(description: string) {
    this.props.description = description
  }

  set is_active(is_active: boolean) {
    this.props.is_active = is_active
  }

  set created_at(created_at: Date) {
    this.props.created_at = created_at
  }

}

/*
Category : id: uuid
Category : name: string
Category : description: string
Category : is_active: boolean
Category : created_at: date

Category : create()
Category : update()
Category : activate()
Category : deactivate()
Category : delete()
*/
