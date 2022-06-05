import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest } from "../../helpers";
import { EmailValidator, HttpRequest } from "../../protocols";
import { SignUpController } from "./sign-up-controller";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    validate(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

const fakerRequest: HttpRequest = {
  body: {
    name: "any_name",
    age: 10,
    birth: new Date(),
    address: "any_address",
    email: "any_email@mail.com",
    password: "any_password",
  },
};

describe("SignUpController", () => {
  test("Should the handle method calls with correct request", () => {
    const { sut } = makeSut();
    const handleSpy = jest.spyOn(sut, "handle");
    const request = fakerRequest;
    sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  test("Should return 400 if missing params", async () => {
    const { sut } = makeSut();
    const request = { body: {} };
    const response = await sut.handle(request);
    expect(response).toEqual(
      badRequest(
        new MissingParamError([
          "name",
          "age",
          "birth",
          "address",
          "email",
          "password",
        ])
      )
    );
  });

  test("Should return 400 if email is invalid", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const request = { ...fakerRequest, email: "invalid_mail" };
    jest.spyOn(emailValidatorStub, "validate").mockReturnValue(false);
    const response = await sut.handle(request);
    expect(response).toEqual(badRequest(new InvalidParamError("email")));
  });
});
