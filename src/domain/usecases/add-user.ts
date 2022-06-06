import { User } from '../models/user'

export interface AddUser {
  add: (user: AddUser.Params) => Promise<AddUser.Result>
}

export namespace AddUser {
  export interface Params {
    name: string
    age: string
    birth: Date
    address: string
    email: string
    password: string
  }

  export type Result = User
}
