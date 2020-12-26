import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPlayer } from './interfaces/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<IPlayer>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async store(player: IPlayer): Promise<void> {
    try {
      const createPlayer = new this.playerModel(player);
      createPlayer.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async getAllPlayer(): Promise<IPlayer[]> {
    try {
      return await this.playerModel.find();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async getPlayerById(_id: string): Promise<IPlayer> {
    try {
      return await this.playerModel.findOne({ _id });
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async updatePlayer(_id: string, player: IPlayer): Promise<void> {
    try {
      await this.playerModel.findOneAndUpdate({ _id }, { $set: player });
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async destroy(_id): Promise<void> {
    try {
      await this.playerModel.deleteOne({ _id });
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
}
