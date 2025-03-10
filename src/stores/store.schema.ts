import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({
  collection: 'stores',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Store {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  location: string;

  @Prop({ required: false, type: String })
  manager_id: string;

  @Prop({ required: false, type: Number, default: 0 })
  cash_in_vault: number;

  @Prop({ required: false, type: Number, default: 0 })
  cash_in_vault_a_day: number;

  @Prop({ required: false, type: Number, default: 0 })
  sales: number;

  @Prop({ required: false, type: Number, default: 0 })
  sales_a_day: number;

  @Prop({ required: false, type: Number, default: 0 })
  revenue: number;

  @Prop({ required: false, type: Number, default: 0 })
  revenue_a_day: number;

  @Prop({ required: false, type: Number, default: 0 })
  discount: number;

  @Prop({ required: false, type: Number, default: 0 })
  discount_a_day: number;
}

const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.index({ name: 1 }, { unique: true });
StoreSchema.index({ manager_id: 1 });
export { StoreSchema };
