import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductVariant } from './product-variant.schema';

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

  @Prop({ required: false, type: String })
  material: string;

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  brand: string;

  @Prop({ required: true, type: [ProductVariant] })
  product_variant: ProductVariant[];
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ barcode_number: 1 }, { unique: true });
export { ProductSchema };
