import { Injectable, Logger } from '@nestjs/common';
import { ICategory } from './interfaces/category.interface';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
  ) {}

  async createCategory(category: ICategory): Promise<void> {
    try {
      this.logger.log(`category: ${JSON.stringify(category)}`);
      const createCategory = new this.categoryModel(category);
      this.logger.log(`createCategory: ${JSON.stringify(createCategory)}`);
      await createCategory.save();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await this.categoryModel.find();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async getByCategoryId(_id: string): Promise<ICategory> {
    try {
      return await this.categoryModel.findOne({ _id });
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async update(_id: string, category: ICategory): Promise<void> {
    try {
      await this.categoryModel.findByIdAndUpdate({ _id }, { $set: category });
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }
}
