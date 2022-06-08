import { AddUser } from '../../../domain/usecases'
import { UnderageError } from '../../errors'
import { AddUserRepository, Encrypter } from '../../protocols'
import { getAgeByBirth } from '../../services'

export class DBAddUser implements AddUser {
  constructor (private readonly encrypter: Encrypter, private readonly addUserRepository: AddUserRepository) {}

  async add (user: AddUser.Params): Promise<AddUser.Result> {
    const age = getAgeByBirth(user.birth)

    if (age < 16) {
      return new Promise((resolve, reject) => reject(new UnderageError()))
    }

    const encryptedPassword = this.encrypter.encrypt(user.password)

    await this.addUserRepository.create({ ...user, password: encryptedPassword })

    return new Promise((resolve) => resolve(null))
  }
}
