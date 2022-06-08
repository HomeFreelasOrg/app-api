import { AddUser } from '../../../domain/usecases'
import { EmailAlrearyInUseError, UnderageError } from '../../errors'
import { AddUserRepository, CheckUserExistsByEmailRepository, Encrypter } from '../../protocols'
import { DBAddUser } from './db-add-user'

interface SutTypes {
  sut: DBAddUser
  encrypterStub: Encrypter
  addUserRepositoryStub: AddUserRepository
  checkUserExistsByEmailRepository: CheckUserExistsByEmailRepository
}

const fakerUser: AddUser.Params = {
  name: 'any_name',
  age: 'any_age',
  address: 'any_address',
  email: 'any_mail@mail.com',
  birth: new Date(2000, 9, 5),
  password: 'any_password'
}

const makeCheckUserExistsByEmailRepository = (): CheckUserExistsByEmailRepository => {
  class CheckUserExistsByEmailRepositoryStub implements CheckUserExistsByEmailRepository {
    async check (email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(false))
    }
  }
  return new CheckUserExistsByEmailRepositoryStub()
}

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async create (user: AddUser.Params): Promise<AddUser.Result> {
      return new Promise((resolve) => resolve({
        id: 'any_id',
        ...user
      }))
    }
  }
  return new AddUserRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (valueToEncrypt: string): string {
      return 'encrypted_value'
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const checkUserExistsByEmailRepository = makeCheckUserExistsByEmailRepository()
  const addUserRepositoryStub = makeAddUserRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DBAddUser(encrypterStub, addUserRepositoryStub, checkUserExistsByEmailRepository)
  return {
    sut,
    encrypterStub,
    addUserRepositoryStub,
    checkUserExistsByEmailRepository
  }
}

describe('DBAddUser', () => {
  test('Should call with correct values', async () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    await sut.add(fakerUser)
    expect(addSpy).toHaveBeenCalledWith(fakerUser)
  })

  test('Should throws an UnderageError if the user\'s age is less than 16 years', () => {
    const { sut } = makeSut()
    const promise = sut.add({ ...fakerUser, birth: new Date(2008, 8, 12) })
    expect(promise).rejects.toThrow(new UnderageError())
  })

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(fakerUser)
    expect(encryptSpy).toHaveBeenCalledWith(fakerUser.password)
  })

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(addUserRepositoryStub, 'create')
    await sut.add(fakerUser)
    expect(createSpy).toHaveBeenCalledWith({ ...fakerUser, password: 'encrypted_value' })
  })

  test('Should throws if Encrypter throws', () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(fakerUser)
    expect(promise).rejects.toThrow(new Error())
  })

  test('Should throws if AddUserRepository throws', () => {
    const { sut, addUserRepositoryStub } = makeSut()
    jest.spyOn(addUserRepositoryStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(fakerUser)
    expect(promise).rejects.toThrow(new Error())
  })

  test('Should return user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.add(fakerUser)
    expect(user).toEqual({ ...fakerUser, id: 'any_id', password: 'encrypted_value' })
  })

  test('Should call CheckUserExistsByEmailRepository with correct email', async () => {
    const { sut, checkUserExistsByEmailRepository } = makeSut()
    const checkSpy = jest.spyOn(checkUserExistsByEmailRepository, 'check')
    await sut.add(fakerUser)
    expect(checkSpy).toHaveBeenCalledWith(fakerUser.email)
  })

  test('Should throws if CheckUserExistsByEmailRepository throws', () => {
    const { sut, checkUserExistsByEmailRepository } = makeSut()
    jest.spyOn(checkUserExistsByEmailRepository, 'check').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add(fakerUser)
    expect(promise).rejects.toThrow(new Error())
  })

  test('Should throws an EmailAlreadyInUseError if already exists a user with the email inserted', () => {
    const { sut, checkUserExistsByEmailRepository } = makeSut()
    jest.spyOn(checkUserExistsByEmailRepository, 'check').mockReturnValue(new Promise((resolve) => resolve(true)))
    const promise = sut.add(fakerUser)
    expect(promise).rejects.toThrow(new EmailAlrearyInUseError())
  })
})
