import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../dtos/user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: Object })
  email: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;

  @Prop({ required: false, type: String })
  store_id: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ store_id: 1 });
export { UserSchema };
