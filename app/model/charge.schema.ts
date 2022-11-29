import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
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

  @Column()
  dateOfService: number;

  @ManyToOne('Booking', 'charges', { onDelete: 'CASCADE' })
  booking: Booking;

  @Column()
  @RelationId((charge: Charge) => charge.booking)
  bookingId: number

}
