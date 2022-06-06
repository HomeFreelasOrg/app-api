import { EmailValidatorAdapter } from '.'

describe('EmailValidatorAdapter', () => {
  test('Should call with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const validateSpy = jest.spyOn(sut, 'validate')
    sut.validate('any_mail')
    expect(validateSpy).toHaveBeenCalledWith('any_mail')
  })
})
