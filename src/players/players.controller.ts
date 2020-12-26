import { Controller, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';
import { IPlayer } from './interfaces/player.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  logger = new Logger(PlayersController.name);

  @EventPattern('create-player')
  async createPlayer(@Payload() player: IPlayer, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`Player: ${JSON.stringify(player)}`);

    try {
      await this.playersService.store(player);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-players')
  async getPlayers(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.playersService.getPlayerById(_id);
      } else {
        return await this.playersService.getAllPlayer();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-player')
  async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const _id: string = data.id;
      const player: IPlayer = data.player;
      await this.playersService.updatePlayer(_id, player);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.playersService.destroy(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
