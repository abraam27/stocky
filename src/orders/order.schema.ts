import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderProductDto, OrderStatus, PaymentMethod } from './order.dto';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  collection: 'orders',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
  @Prop({
    required: true,
    type: String,
    enum: OrderStatus,
    default: OrderStatus.Completed,
  })
  status: OrderStatus;

  @Prop({ required: false, type: String })
  customer_id: string;

  @Prop({ required: true, type: String })
  user_id: string;

  @Prop({ required: true, type: String })
  store_id: string;

  @Prop({ required: true, type: [OrderProductDto] })
  products: OrderProductDto[];

  @Prop({ required: true, type: Number, default: 0 })
  discount: number;

  @Prop({ required: true, type: Number, default: 0 })
  discount_value: number;

  @Prop({ required: true, type: Number })
  subtotal: number;

  @Prop({ required: true, type: Number })
  total: number;

  @Prop({ required: true, type: Number })
  total_discount: number;

  @Prop({ required: true, type: Number })
  total_discount_value: number;

  @Prop({
    required: true,
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.Cash,
  })
  payment_method: PaymentMethod;
}

const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user_id: 1, store_id: 1 });
export { OrderSchema };
