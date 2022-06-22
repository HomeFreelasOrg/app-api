import { AddUser } from '@/domain/usecases'

export interface AddUserRepository {
  create: (user: AddUser.Params) => Promise<AddUser.Result>
}
