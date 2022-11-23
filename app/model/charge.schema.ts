import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Booking} from "./booking.schema";

@Entity()
export class Charge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 256 })
  chargeName: string;

  @Column('real')
  price: number;

  @Column()
  quantity: number;

  @ManyToOne('Booking', 'charges')
  booking: Booking

}
