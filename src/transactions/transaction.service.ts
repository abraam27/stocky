import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { MongoDbFindOptions } from 'src/common/db';
import { isAdmin, isOwner } from 'src/common/constants';
import { AuthorizationError } from 'src/common/exceptions';
import { User } from 'src/users/user.dto';
import { Transaction } from './transaction.schema';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto, TransactionType, UpdateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTransactions(options: MongoDbFindOptions<any>) {
    const query: FilterQuery<Transaction> = {};

    if (options.filter?._id) {
      query._id = new Types.ObjectId(options.filter?._id);
    }

    if (options.filter?.name) {
      query.name = options.filter?.name;
    }

    if (options.filter?.alias) {
      query.alias = options.filter?.alias;
    }

    if (options.filter?.organization_id) {
      query.organization_id = options.filter?.organization_id;
    }

    if (options.filter?.fund_raiser_id) {
      query.fund_raiser_id = { $in: [options.filter?.fund_raiser_id, null] };
    }

    if (options.filter?.plaid_id) {
      query['plaid.id'] = options.filter?.plaid_id;
    }

    if (options?.filter?.key) {
      query.$or = [{ name: { $regex: options.filter.key, $options: 'i' } }];
    }

    return this.transactionRepository.findAndPaginate({
      ...options?.filter,
      ...options,
      filter: query,
    });
  }

  async getTransactionById(TransactionId: string) {
    const Transaction =
      await this.transactionRepository.findById(TransactionId);
    if (!Transaction)
      throw new NotFoundException(
        `Transaction with ID ${TransactionId} not found`,
      );
    return Transaction;
  }

  async createTransaction(dto: CreateTransactionDto, user: User) {
    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');
    return await this.transactionRepository.createTransaction(dto);
  }

  async updateTransaction(
    TransactionId: string,
    dto: UpdateTransactionDto,
    user: User,
  ) {
    const Transaction =
      await this.transactionRepository.findById(TransactionId);
    if (!Transaction)
      throw new NotFoundException(
        `Transaction with ID ${TransactionId} not found`,
      );

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    return await this.transactionRepository.updateTransactionById(
      Transaction._id,
      dto,
    );
  }

  async deleteTransaction(TransactionId: string, user: User) {
    const Transaction =
      await this.transactionRepository.findById(TransactionId);
    if (!Transaction)
      throw new NotFoundException(
        `Transaction with ID ${TransactionId} not found`,
      );

    const _isOwner = isOwner(user);
    if (!_isOwner) throw new AuthorizationError('Action not allowed');

    await this.transactionRepository.deleteTransactionById(Transaction._id);
    return { _id: Transaction._id };
  }

  async addTransaction(
    TransactionId: string,
    transaction: CreateTransactionDto,
    user: User,
  ) {
    const Transaction =
      await this.transactionRepository.findById(TransactionId);
    if (!Transaction)
      throw new NotFoundException(
        `Transaction with ID ${TransactionId} not found`,
      );

    const _isAdmin = isAdmin(user);
    if (!_isAdmin) throw new AuthorizationError('Action not allowed');

    const update: any = {
      $push: { transactions: transaction },
    };

    if (transaction.type === TransactionType.Deposit) {
      update.$inc = { cashInVault: transaction.amount };
    } else if (transaction.type === TransactionType.Withdraw) {
      update.$inc = { cashInVault: -transaction.amount };
    }

    const updatedTransaction =
      await this.transactionRepository.updateTransactionById(
        TransactionId,
        update,
      );

    if (!updatedTransaction) {
      throw new Error('Transaction not found');
    }

    return updatedTransaction;
  }

  // async removeTransaction(
  //   TransactionId: string,
  //   transactionId: string,
  //   user: User,
  // ) {
  //   const Transaction = await this.transactionRepository.findById(TransactionId);
  //   if (!Transaction)
  //     throw new NotFoundException(`Transaction with ID ${TransactionId} not found`);

  //   const _isAdmin = isAdmin(user);
  //   if (!_isAdmin) throw new AuthorizationError('Action not allowed');

  //   const transaction = Transaction.transactions.find(
  //     (t) => t.id === transaction.transactionId,
  //   );
  //   if (!transaction) {
  //     throw new Error('Transaction not found');
  //   }

  //   const update: any = {
  //     $pull: { transactions: { _id: transactionId } },
  //   };

  //   if (transaction.type === 'add') {
  //     update.$inc = { cashInVault: -transaction.amount };
  //   } else if (transaction.type === 'remove') {
  //     update.$inc = { cashInVault: transaction.amount };
  //   }

  //   return await this.transactionRepository.updateTransactionById(
  //     TransactionId,
  //     update,
  //   );
  // }
}
