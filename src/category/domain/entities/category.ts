export type CategoryProps = {
  name: string
  description?: string
  is_active?: boolean
  created_at?: Date
}

export default class Category {

  constructor(public readonly props: CategoryProps) {
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
