export class MissingParamError extends Error {
  constructor (paramsNames: string[]) {
    const [firstParam, ...restOfParams] = paramsNames
    super(
      `Missing the following params: ${restOfParams.map(
        (param) => `${param}, `
      )}${firstParam}.`
    )
    this.name = 'MissingParamError'
  }
}
