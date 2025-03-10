import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import {
  Transaction,
  TransactionDocument,
} from './transaction.schema';

@Injectable()
export class TransactionRepository extends MongoRepo<TransactionDocument> {
  constructor(
    @InjectModel(Transaction.name) model: Model<TransactionDocument>,
  ) {
    super(model);
  }
  async createTransaction(data: Partial<Transaction>) {
    const [transaction] = await this.model.create([data]);
    return transaction.toObject();
  }

  async updateTransactionById(
    _id: Types.ObjectId | string,
    data: Partial<Transaction>,
  ) {
    const transaction = await this.model.findOneAndUpdate({ _id }, data, {
      new: true,
    });
    if (!transaction) return null;
    return transaction.toObject();
  }

  async deleteTransactionById(_id: Types.ObjectId | string) {
    const transaction = await this.model.findOneAndDelete({ _id });
    if (!transaction) return null;
    return transaction.toObject();
  }
}
