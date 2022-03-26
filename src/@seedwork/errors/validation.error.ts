export default class ValidationError extends Error {

  constructor(message?: string) {
    super(message || 'Invalid property')
    this.name = 'ValidationError'
  }

}