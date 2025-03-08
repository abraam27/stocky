import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransactionType } from '../dtos/store.dto';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class transaction {
  @Prop({ required: true, type: String, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  reason: string;
}

export const transactionSchema = SchemaFactory.createForClass(transaction);
