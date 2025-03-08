import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'products',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Product {
  @Prop({ required: true, type: String })
  barcode_number: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  category: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: false, type: String })
  color: string;

  @Prop({ required: false, type: String })
  size: string;

  @Prop({ required: false, type: String })
  material: string;

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  brand: string;

  @Prop({ required: false, type: Number, default: 1 })
  quantity: number;

  @Prop({ required: true, type: String })
  saved_by: string;

  @Prop({ required: false, type: String, default: null })
  store_id: string;

  @Prop({ required: true, type: String, default: null })
  confirmed_by: string;

  @Prop({ required: true, type: String, default: null })
  reviewed_by: string;
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ barcode_number: 1 }, { unique: true });
ProductSchema.index({ user_id: 1, saved_by: 1 });
export { ProductSchema };
