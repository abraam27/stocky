import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransactionType } from '../dtos/transaction.dto';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  collection: 'transactions',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Transaction {
  @Prop({ required: true, type: String, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  reason: string;

  @Prop({ type: String, required: true })
  store_id: string;
}

const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ store_id: 1 });
export { TransactionSchema };
