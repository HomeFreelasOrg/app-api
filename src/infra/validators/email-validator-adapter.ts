import { EmailValidator } from '../../presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  validate (email: string): boolean {
    return true
  }
}
