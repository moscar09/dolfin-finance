import { Injectable } from '@nestjs/common';
import { BankAccount } from '../entities/bankAccount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>
  ) {}

  findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepository.find();
  }
}
