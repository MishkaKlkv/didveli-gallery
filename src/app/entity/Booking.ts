import {Room} from './Room';
import {Charge} from './Charge';
import {Client} from './Client';

export class Booking {
  private _id: number;
  private _client: Client;
  private _room: Room;
  private _arrivalDate: number;
  private _departureDate: number;
  private _lessor: string;
  private _portal: string;
  private _isPassive = false;
  private _charges: Charge[];

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get client(): Client {
    return this._client;
  }

  set client(value: Client) {
    this._client = value;
  }

  get room(): Room {
    return this._room;
  }

  set room(value: Room) {
    this._room = value;
  }

  get arrivalDate(): number {
    return this._arrivalDate;
  }

  set arrivalDate(value: number) {
    this._arrivalDate = value;
  }

  get departureDate(): number {
    return this._departureDate;
  }

  set departureDate(value: number) {
    this._departureDate = value;
  }

  get lessor(): string {
    return this._lessor || 'Test';
  }

  set lessor(value: string) {
    this._lessor = value;
  }

  get portal(): string {
    return this._portal;
  }

  set portal(value: string) {
    this._portal = value;
  }

  get isPassive(): boolean {
    return this._isPassive;
  }

  set isPassive(value: boolean) {
    this._isPassive = value;
  }

  get charges(): Charge[] {
    return this._charges;
  }

  set charges(value: Charge[]) {
    this._charges = value;
  }

  get total() {
    return this.charges.reduce(
      (accumulator, charge) => {
        if (charge.chargeName === 'Deposit') {
          return accumulator - (charge.price * charge.quantity);
        } else {
          return accumulator + (charge.price * charge.quantity);
        }
      }, 0
    );
  }
}
