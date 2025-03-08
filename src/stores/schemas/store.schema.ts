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
  cashInVault: number;
}

const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.index({ name: 1 }, { unique: true });
StoreSchema.index({ manager_id: 1 });
export { StoreSchema };
