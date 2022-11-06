import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 256 })
  roomNumber: string;

  @Column('varchar', { length: 256 })
  owner: string;
}
