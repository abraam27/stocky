import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Balance {
  @Prop({ required: true, type: String })
  point_id: string;

  @Prop({ required: true, type: Number })
  value: number;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
