import { Controller, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  EventPattern,
  Payload,
  RmqContext,
  Ctx,
  MessagePattern,
} from '@nestjs/microservices';
import { ICategory } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: ICategory,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`category ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.createCategory(category);
      await channel.ack(originalMsg);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(category)}`);

      const filterAckErrors = ackErrors.filter(ackError =>
        e.message.includes(ackError),
      );

      if (filterAckErrors.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (_id) {
        return await this.categoriesService.getByCategoryId(_id);
      }

      return await this.categoriesService.getAllCategories();
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Category: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const category: ICategory = data.category;

      await this.categoriesService.update(_id, category);
      await channel.ack(originalMsg);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e)}`);
      const filterAckErrors = ackErrors.filter(ackError =>
        e.message.includes(ackError),
      );

      if (filterAckErrors.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
