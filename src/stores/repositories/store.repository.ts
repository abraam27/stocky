import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepo } from 'src/common/db';
import { Store, StoreDocument } from '../schemas/store.schema';

@Injectable()
export class StoreRepository extends MongoRepo<StoreDocument> {
  constructor(@InjectModel(Store.name) model: Model<StoreDocument>) {
    super(model);
  }
  async createStore(data: Partial<Store>) {
    const [store] = await this.model.create([data]);
    return store.toObject();
  }

  async updateStoreById(_id: Types.ObjectId | string, data: Partial<Store>) {
    const store = await this.model.findOneAndUpdate({ _id }, data, {
      new: true,
    });
    if (!store) return null;
    return store.toObject();
  }

  async deleteStoreById(_id: Types.ObjectId | string) {
    const store = await this.model.findOneAndDelete({ _id });
    if (!store) return null;
    return store.toObject();
  }
}
