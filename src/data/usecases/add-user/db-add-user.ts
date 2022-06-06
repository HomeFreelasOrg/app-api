import { AddUser } from '../../../domain/usecases'

export class DBAddUser implements AddUser {
  async add (user: AddUser.Params): Promise<AddUser.Result> {
    return await new Promise((resolve) => resolve(null))
  }
}
