import { randomUUID } from 'crypto'
import InvalidUuidError from "../../errors/invalid-uuid.error"
import ValueObject from "./value-object"

export default class UniqueEntityId extends ValueObject<string>{

  constructor(id?: string) {
    super(id || randomUUID())
    this.validate()
  }

  private validate () {
    const regexUUID = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    const isValid = this.value.match(regexUUID)
    if (!isValid) throw new InvalidUuidError()
  }

}