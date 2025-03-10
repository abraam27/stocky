import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionService } from './transaction.service';
import { TransactionsAdminController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsAdminController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionsModule {}
