import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Quantity } from './product.dto';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({
  collection: 'product-variants',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ProductVariant {
  @Prop({ required: false, type: [{ store_id: String, quantity: Number, confirmed_by: String }], default: [], _id: false })
  quantity: { store_id: string; quantity: number, confirmed_by: string }[];

  @Prop({ required: true, type: Number })
  cost_price: number;

  @Prop({ required: true, type: Number, })
  selling_price: number;

  @Prop({ required: false, type: Number, })
  discount_price: number;

  @Prop({ required: true, type: String, })
  color: string;

  @Prop({ required: true, type: String, })
  size: string

  @Prop({ required: true, type: Boolean, default: false })
  in_stock: boolean;

  @Prop({ required: true, type: Number, default: 0 })
  sku: number; // stock keeping unit

  @Prop({ required: true, type: String })
  saved_by: string;
};

const ProductSchema = SchemaFactory.createForClass(ProductVariant);
export { ProductSchema };
