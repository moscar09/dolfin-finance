import { Injectable } from '@nestjs/common';
import { BankAccount } from '../entities/bankAccount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { BankAccountType } from '@dolfin-finance/api-types';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>
  ) {}

  findAll(filter?: { type?: BankAccountType[] }): Promise<BankAccount[]> {
    const query: FindOptionsWhere<BankAccount> = {};

    if (filter.type) {
      query['type'] = In(filter.type);
    }
    return this.bankAccountRepository.find({ where: query });
  }

  findById(id: number): Promise<BankAccount> {
    return this.bankAccountRepository.findOneBy({ id });
  }
}
