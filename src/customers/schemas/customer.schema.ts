import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  collection: 'customers',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Customer {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: false, type: [String], default: [] })
  orders: string[];

  @Prop({ required: true, type: String })
  saved_by: string;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ phone: 1, saved_by: 1 });
export { CustomerSchema };
