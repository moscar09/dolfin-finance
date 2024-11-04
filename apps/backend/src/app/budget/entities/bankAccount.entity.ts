import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum BankAccountType {
  ASSET = 'asset',
  EXTERNAL = 'external',
}

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  prettyname: string;

  @Column()
  identifier: string;

  @Column()
  bankAccountType: BankAccountType;
}
