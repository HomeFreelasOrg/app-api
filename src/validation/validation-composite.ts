import { Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (inputFields: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(inputFields)
      if (error) {
        return error
      }
    }
  }
}
