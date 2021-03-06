import { AddUser } from '@/domain/usecases'
import { EmailAlrearyInUseError, UnderageError } from '../errors'
import { AddUserRepository, CheckUserExistsByEmailRepository, Encrypter } from '../protocols'
import { getAgeByBirth } from '../services'

export class DBAddUser implements AddUser {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addUserRepository: AddUserRepository,
    private readonly checkUserExistsByEmailRepository: CheckUserExistsByEmailRepository
  ) {}

  async add (user: AddUser.Params): Promise<AddUser.Result> {
    const age = getAgeByBirth(user.birth)

    if (age < 16) {
      throw new UnderageError()
    }

    const userAlreadyExists = await this.checkUserExistsByEmailRepository.check(user.email)

    if (userAlreadyExists) {
      throw new EmailAlrearyInUseError()
    }

    const encryptedPassword = this.encrypter.encrypt(user.password)

    const createdUser = await this.addUserRepository.create({ ...user, password: encryptedPassword })

    return createdUser
  }
}
