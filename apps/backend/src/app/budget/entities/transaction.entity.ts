import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from './bankAccount.entity';
import { BudgetAllocation } from './budgetAllocation.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceId: string;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  humanDescription: string;

  @Column()
  isDebit: boolean;

  @Column({ type: 'int' })
  amountCents: number;

  @ManyToOne(() => BankAccount)
  sourceAccount: BankAccount;

  @ManyToOne(() => BankAccount)
  destAccount: BankAccount;

  @ManyToOne(() => BudgetAllocation, { nullable: true })
  allocation?: BudgetAllocation;
}
/**
 *   @Id
    @GeneratedValue
    Long id;

    String referenceId;
    LocalDate date;

    @Column(columnDefinition = "TEXT")
    String description;
    String humanDescription;
    Boolean isDebit;

    @Column(columnDefinition = "DECIMAL(10,2)")
    BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "source_account_id")
    @ToString.Exclude

    BankAccount sourceAccount;

    @ManyToOne
    @JoinColumn(name = "dest_account_id")
    @ToString.Exclude

    BankAccount destAccount;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "allocation_id")
    @ToString.Exclude
    BudgetAllocation allocation;
 */
