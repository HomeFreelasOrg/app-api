import { MissingParamError } from '../presentation/errors'
import { Validation } from './validation'

export class RequiredFieldsValidation implements Validation {
  constructor (private readonly inputFieldsNames: string[]) {}

  validate (inputFields: any): Error {
    const fieldsWithErrorNames: string[] = []
    for (const inputFieldName of this.inputFieldsNames) {
      if (!inputFields[inputFieldName]) {
        fieldsWithErrorNames.push(inputFieldName)
      }
    }
    return new MissingParamError(fieldsWithErrorNames)
  }
}
