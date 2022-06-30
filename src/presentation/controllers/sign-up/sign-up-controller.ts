import { AddUser } from '@/domain/usecases'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator
} from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'birth',
        'address',
        'email',
        'password'
      ]

      const missingFields = []

      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          missingFields.push(requiredField)
        }
      }

      if (missingFields.length > 0) {
        return badRequest(new MissingParamError(missingFields))
      }

      if (!this.emailValidator.validate(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const newUser = await this.addUser.add(httpRequest.body)

      return ok(newUser)
    } catch (error) {
      return serverError(error)
    }
  }
}
