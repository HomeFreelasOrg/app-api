import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers";
import { HttpRequest } from "../../protocols";
import { SignUpController } from "./sign-up-controller";

interface SutTypes {
  sut: SignUpController;
}

const makeSut = (): SutTypes => {
  const sut = new SignUpController();
  return {
    sut,
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
});
