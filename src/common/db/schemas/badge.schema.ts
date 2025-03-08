import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Badge {
  @Prop({ required: true, type: String })
  id: string;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
