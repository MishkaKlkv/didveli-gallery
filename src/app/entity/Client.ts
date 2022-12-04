export class Client {
  private _id: number;
  private _name: string;
  private _surname: string;
  private _passport: string;
  private _passportDate: number;
  private _citizenship: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get surname(): string {
    return this._surname;
  }

  set surname(value: string) {
    this._surname = value;
  }

  get passport(): string {
    return this._passport;
  }

  set passport(value: string) {
    this._passport = value;
  }

  get passportDate(): number {
    return this._passportDate;
  }

  set passportDate(value: number) {
    this._passportDate = value;
  }

  get citizenship(): string {
    return this._citizenship;
  }

  set citizenship(value: string) {
    this._citizenship = value;
  }

  get fullName() {
    return `${this._name} ${this._surname}`;
  }

  public toDto() {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      passport: this.passport,
      passportDate: this.passportDate,
      citizenship: this.citizenship,
    };
  }
}
