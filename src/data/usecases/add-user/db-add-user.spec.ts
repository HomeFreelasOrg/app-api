import { AddUser } from '../../../domain/usecases'
import { DBAddUser } from './db-add-user'

interface SutTypes {
  sut: DBAddUser
}

const fakerUser: AddUser.Params = {
  name: 'any_name',
  age: 'any_age',
  address: 'any_address',
  email: 'any_mail@mail.com',
  birth: new Date(2022, 9, 5),
  password: 'any_password'
}

const makeSut = (): SutTypes => {
  const sut = new DBAddUser()
  return {
    sut
  }
}

describe('DBAddUser', () => {
  test('Should call with correct values', () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    sut.add(fakerUser)
    expect(addSpy).toHaveBeenCalledWith(fakerUser)
  })
})
