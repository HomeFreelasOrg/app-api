export class User {
  constructor (
    private readonly id: string,
    private readonly name: string,
    private readonly birth: Date,
    private readonly address: string,
    private readonly email: string,
    private readonly password: string
  ) {}
}
