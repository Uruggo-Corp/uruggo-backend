import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HelpersService } from '../shared/libs/helpers/helpers.service';
import { getPaginatedResult } from '../shared/libs/utils/pagination';
import {
  PaginateParams,
  PaginatedResultDto,
} from '../shared/types/pagination.types';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { AgentProfile, Role, User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AgentProfile.name) private agentModel: Model<AgentProfile>,
    private readonly helpersService: HelpersService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const formerUser = await this.userModel.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (formerUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await this.helpersService.hashPassword(
      data.password,
    );
    data.password = hashedPassword;

    const createdUser = new this.userModel(data);
    await createdUser.save();

    const user = await this.userModel
      .findOne({ email: createdUser.email })
      .select('-password');
    return user;
  }

  async createAgent(data: CreateAgentDto): Promise<User> {
    const formerUser = await this.userModel.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (formerUser) {
      throw new ConflictException('User already exists');
    }

    const formerAgent = await this.agentModel.findOne({
      idNumber: data.idNumber,
    });

    if (formerAgent) {
      throw new ConflictException('Agent with this ID Number already exists');
    }

    // Hash password
    const hashedPassword = await this.helpersService.hashPassword(
      data.password,
    );
    data.password = hashedPassword;

    const createdUser = await this.userModel.create({
      ...data,
      role: Role.AGENT,
    });

    const agent = await this.agentModel.create({
      userId: createdUser._id,
      agency: data.agency,
      address: data.address,
      idNumber: data.idNumber,
      idType: data.idType,
      idImages: data.idImages,
    });

    await this.userModel.findByIdAndUpdate(createdUser._id, {
      agentProfile: agent._id,
    });

    const user = await this.userModel
      .findById(createdUser._id)
      .populate('agentProfile')
      .select('-password');

    return user;
  }

  async findAll(
    paginateParams: PaginateParams,
  ): Promise<PaginatedResultDto<User>> {
    const users = await getPaginatedResult<User>(
      this.userModel,
      paginateParams,
    );
    return users;
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findById(id)
        .populate('agentProfile')
        .select('-password');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  async findOneWithPassword(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).populate('agentProfile');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .populate('agentProfile')
        .select('-password');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .populate('agentProfile');
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }
}
