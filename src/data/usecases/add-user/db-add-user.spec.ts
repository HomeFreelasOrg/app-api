import { AddUser } from '../../../domain/usecases'
import { UnderageError } from '../../errors'
import { Encrypter } from '../../protocols'
import { DBAddUser } from './db-add-user'

interface SutTypes {
  sut: DBAddUser
  encrypterStub: Encrypter
}

const fakerUser: AddUser.Params = {
  name: 'any_name',
  age: 'any_age',
  address: 'any_address',
  email: 'any_mail@mail.com',
  birth: new Date(2000, 9, 5),
  password: 'any_password'
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
  const encrypterStub = makeEncrypter()
  const sut = new DBAddUser(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DBAddUser', () => {
  test('Should call with correct values', async () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    await sut.add(fakerUser)
    expect(addSpy).toHaveBeenCalledWith(fakerUser)
  })

  test('Should throws an UnderageError if the user\'s age is less than 16 years', async () => {
    try {
      const { sut } = makeSut()
      await sut.add({ ...fakerUser, birth: new Date(2008, 8, 12) })
    } catch (error) {
      expect(error).toEqual(new UnderageError())
    }
  })

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(fakerUser)
    expect(encryptSpy).toHaveBeenCalledWith(fakerUser.password)
  })
})
