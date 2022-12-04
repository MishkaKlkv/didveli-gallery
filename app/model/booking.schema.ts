import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId} from 'typeorm';
import {Client} from './client.schema';
import {Room} from './room.schema';
import {Charge} from "./charge.schema";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  @JoinColumn()
  client: Client;

  @Column({ nullable: false })
  clientId: number;

  @ManyToOne(() => Room)
  @JoinColumn()
  room: Room;

  @Column({ nullable: false })
  roomId: number;

  @Column()
  arrivalDate: number;

  @Column({nullable: true})
  departureDate: number;

  @Column('varchar', { length: 20, nullable: true })
  lessor: string;

  @Column('varchar', { length: 100, nullable: true })
  portal: string;

  @Column('boolean', {default: false})
  isPassive: boolean = false;

  @OneToMany('Charge', 'booking')
  @JoinColumn()
  charges: Charge[];
}
