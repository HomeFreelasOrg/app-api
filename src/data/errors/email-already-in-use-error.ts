export class EmailAlrearyInUseError extends Error {
  constructor () {
    super('Email already in use')
    this.name = 'EmailAlrearyInUseError'
  }
}
