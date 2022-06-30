export interface AddUser {
  add: (user: AddUser.Params) => Promise<AddUser.Result>
}

export namespace AddUser {
  export interface Params {
    name: string
    birth: Date
    address: string
    email: string
    password: string
  }

  export interface Result {
    id: string
    name: string
    birth: Date
    address: string
    email: string
    password: string
  }
}
