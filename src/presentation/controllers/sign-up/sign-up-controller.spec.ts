import { AddUser } from '../../../domain/usecases'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers'
import { EmailValidator, HttpRequest } from '../../protocols'
import { SignUpController } from './sign-up-controller'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add (user: AddUser.Params): Promise<AddUser.Result> {
      return await new Promise((resolve) => resolve({ ...user, id: 'any_id' }))
    }
  }

  return new AddUserStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addUserStub = makeAddUser()
  const sut = new SignUpController(emailValidatorStub, addUserStub)
  return {
    sut,
    emailValidatorStub,
    addUserStub
  }
}

const fakerRequest: HttpRequest = {
  body: {
    name: 'any_name',
    age: 10,
    birth: new Date(2000, 9, 20),
    address: 'any_address',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

describe('SignUpController', () => {
  test('Should the handle method calls with correct request', () => {
    const { sut } = makeSut()
    const handleSpy = jest.spyOn(sut, 'handle')
    const request = fakerRequest
    sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if missing params', async () => {
    const { sut } = makeSut()
    const request = { body: {} }
    const response = await sut.handle(request)
    expect(response).toEqual(
      badRequest(
        new MissingParamError([
          'name',
          'age',
          'birth',
          'address',
          'email',
          'password'
        ])
      )
    )
  })

  test('Should SignUpController calls EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const request = { body: { ...fakerRequest.body, email: 'invalid_mail' } }
    const validateSpy = jest
      .spyOn(emailValidatorStub, 'validate')
      .mockReturnValue(false)
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith('invalid_mail')
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const request = { body: { ...fakerRequest.body, email: 'invalid_mail' } }
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValue(false)
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const request = fakerRequest
    jest.spyOn(emailValidatorStub, 'validate').mockImplementation(() => {
      throw new Error()
    })
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should SignUpController calls addUserStub with correct values', async () => {
    const { sut, addUserStub } = makeSut()
    const request = fakerRequest
    const addSpy = jest.spyOn(addUserStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      age: 10,
      birth: new Date(2000, 9, 20),
      address: 'any_address',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const request = fakerRequest
    const response = await sut.handle(request)
    expect(response).toEqual(
      ok({
        id: 'any_id',
        name: 'any_name',
        age: 10,
        birth: new Date(2000, 9, 20),
        address: 'any_address',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    )
  })
})
