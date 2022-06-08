import { AddUser } from '../../../domain/usecases'
import { UnderageError } from '../../errors'
import { Encrypter } from '../../protocols'
import { getAgeByBirth } from '../../services'

export class DBAddUser implements AddUser {
  constructor (private readonly encrypter: Encrypter) {}

  async add (user: AddUser.Params): Promise<AddUser.Result> {
    const age = getAgeByBirth(user.birth)

    if (age < 16) {
      return new Promise((resolve, reject) => reject(new UnderageError()))
    }

    this.encrypter.encrypt(user.password)

    return new Promise((resolve) => resolve(null))
  }
}
