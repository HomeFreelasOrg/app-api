import { AddUser } from '../../../domain/usecases'
import { UnderageError } from '../../errors'
import { getAgeByBirth } from '../../services'

export class DBAddUser implements AddUser {
  async add (user: AddUser.Params): Promise<AddUser.Result> {
    const age = getAgeByBirth(user.birth)

    if (age < 16) {
      return new Promise((resolve, reject) => reject(new UnderageError()))
    }

    return new Promise((resolve) => resolve(null))
  }
}
