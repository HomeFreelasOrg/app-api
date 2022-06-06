import { InvalidParamError } from '../presentation/errors'
import { EmailValidator } from '../presentation/protocols'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (private readonly emailValidator: EmailValidator, private readonly inputFieldName: string) {}

  validate (inputFields: any): Error {
    const isValid = this.emailValidator.validate(inputFields[this.inputFieldName])
    if (!isValid) {
      return new InvalidParamError(this.inputFieldName)
    }
  }
}
