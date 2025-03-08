import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionService } from './services/transaction.service';
import { TransactionsAdminController } from './controllers/transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionRepository } from './repositories/transaction.repository';

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
