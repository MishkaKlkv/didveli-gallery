import {Column, Entity, PrimaryGeneratedColumn,} from 'typeorm';

@Entity()
export class Company {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 100})
  name: string;

  @Column('varchar', {length: 100})
  companyId: string;

  @Column('varchar', {length: 256})
  address: string;

  @Column('varchar', {length: 256})
  bank: string;

  @Column('varchar', {length: 50})
  phone: string;

  @Column('varchar', {length: 50})
  email: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => value ? Buffer.from(value) : '',
      from: (value: Buffer) => value?.toString(),
    }
  })
  logo: string;

  @Column('varchar', {length: 100, nullable: true})
  logoName: string;
}
