import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { slugify } from 'src/common/utils';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends MongoRepo<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async generateAlias(title: string, exclude?: { _id: unknown }) {
    const alias = slugify(title);
    const query = !!exclude?._id
      ? { _id: { $ne: new Types.ObjectId(exclude._id.toString()) } }
      : {};
    let count = await this.model.countDocuments({
      alias: { $regex: new RegExp(`^${alias}`) },
      ...query,
    });

    if (count === 0) return alias;
    let uniqueAlias = alias;

    while ((await this.countDocuments({ alias: uniqueAlias, ...query })) > 0) {
      count++;
      uniqueAlias = alias + '-' + count;
    }
    return uniqueAlias;
  }

  async createUser(data: Partial<User>) {
    const session = await this.model.startSession();
    session.startTransaction();
    try {
      const [partner] = await this.model.create([data], { session });
      await session.commitTransaction();
      return partner.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateUserById(_id: Types.ObjectId | string, data: Partial<User>) {
    const session = await this.model.startSession();
    session.startTransaction();
    try {
      const partner = await this.model.findOneAndUpdate({ _id }, data, {
        session,
        new: true,
      });
      if (!partner) return null;
      await session.commitTransaction();
      return partner.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteUserById(_id: Types.ObjectId | string) {
    const session = await this.model.startSession();
    session.startTransaction();
    try {
      const partner = await this.model.findOneAndDelete({ _id }, { session });
      if (!partner) return null;
      await session.commitTransaction();
      return partner.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
