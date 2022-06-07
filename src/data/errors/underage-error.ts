export class UnderageError extends Error {
  constructor () {
    super('Underage Error')
    this.name = 'UnderageError'
  }
}
