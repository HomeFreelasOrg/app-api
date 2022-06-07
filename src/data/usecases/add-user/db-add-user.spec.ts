import { AddUser } from '../../../domain/usecases'
import { UnderageError } from '../../errors'
import { DBAddUser } from './db-add-user'

interface SutTypes {
  sut: DBAddUser
}

const fakerUser: AddUser.Params = {
  name: 'any_name',
  age: 'any_age',
  address: 'any_address',
  email: 'any_mail@mail.com',
  birth: new Date(2000, 9, 5),
  password: 'any_password'
}

const makeSut = (): SutTypes => {
  const sut = new DBAddUser()
  return {
    sut
  }
}

describe('DBAddUser', () => {
  test('Should call with correct values', async () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    await sut.add(fakerUser)
    expect(addSpy).toHaveBeenCalledWith(fakerUser)
  })

  test('Should return an UnderAgeError if the user\'s age is less than 16 years', async () => {
    try {
      const { sut } = makeSut()
      await sut.add({ ...fakerUser, birth: new Date(2008, 8, 12) })
    } catch (error) {
      expect(error).toEqual(new UnderageError())
    }
  })
})
