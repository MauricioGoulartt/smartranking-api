import { Injectable, Query } from '@nestjs/common';
import { PlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  // public methods

  async createUpdatePLayer(playerDto: PlayerDto): Promise<void> {
    const { email } = playerDto;

    const existingPlayer = await this.playerModel.findOne({ email }).exec();

    if (existingPlayer) {
      existingPlayer.name = playerDto.name;

      this.update(existingPlayer, playerDto);
    } else {
      this.create(playerDto);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.findAll();
  }

  async findPlayerByEmail(@Query('email') email: string): Promise<Player> {
    return await this.findByEmail(email);
  }

  async deletePlayer(_id: string): Promise<void> {
    return await this.delete(_id);
  }

  // private methods

  private async create(playerDto: PlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(playerDto);
    return await createdPlayer.save();
  }

  private async update(
    existingPlayer: Player,
    player: PlayerDto,
  ): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ email: existingPlayer.email }, { $set: player })
      .exec();
  }

  private async findAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async findByEmail(email: string): Promise<Player> {
    return await this.playerModel.findOne().where('email').equals(email);
  }

  private async delete(_id: string): Promise<void> {
    await this.playerModel.findOneAndDelete({ _id }).exec();
  }
}
