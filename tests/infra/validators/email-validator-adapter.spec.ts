import { EmailValidatorAdapter } from '../../../src/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  test('Should call with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const validateSpy = jest.spyOn(sut, 'validate')
    sut.validate('any_mail')
    expect(validateSpy).toHaveBeenCalledWith('any_mail')
  })

  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const validateSpy = jest.spyOn(validator, 'isEmail')
    validateSpy.mockReturnValueOnce(false)
    const isValidEmail = sut.validate('any_mail')
    expect(isValidEmail).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail')
    const isValidEmail = sut.validate('any_mail')
    expect(isValidEmail).toBe(true)
  })

  test('Should call validator with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const validateSpy = jest.spyOn(validator, 'isEmail')
    sut.validate('any_mail')
    expect(validateSpy).toHaveBeenCalledWith('any_mail')
  })
})
