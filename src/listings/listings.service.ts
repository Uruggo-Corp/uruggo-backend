import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginatedResult } from '../shared/libs/utils/pagination';
import { PaginateParams } from '../shared/types/pagination.types';
import { CreateListingDto } from './dtos/create-listing.dto';
import { Listing, ListingStatus } from './schemas/listings.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
  ) {}

  async create(data: CreateListingDto, currentUser: User) {
    const createdListing = new this.listingModel({
      ...data,
      agent: currentUser._id,
      status: ListingStatus.pending,
    });
    await createdListing.save();
    return createdListing;
  }

  async findAll(paginateParams: PaginateParams) {
    return getPaginatedResult(this.listingModel, paginateParams);
  }

  async search(query: string, paginateParams: PaginateParams) {
    const filter = {
      $text: { $search: query },
    };

    const updatedFilter = {
      ...paginateParams.filter,
      ...filter,
    };

    paginateParams.filter = updatedFilter;

    return getPaginatedResult(this.listingModel, paginateParams);
  }

  async findOne(id: string) {
    try {
      return this.listingModel.findById(id).populate({
        path: 'agent',
        select: '-password',
        model: 'User',
        populate: {
          path: 'agentProfile',
          model: 'AgentProfile',
        },
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      return this.listingModel.findOne({ slug }).populate({
        path: 'agent',
        select: '-password',
        model: 'User',
        populate: {
          path: 'agentProfile',
          model: 'AgentProfile',
        },
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  async markAsActive(slug: string) {
    try {
      return this.listingModel.findOneAndUpdate(
        { slug },
        { status: ListingStatus.active },
        { new: true },
      );
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Listing not found');
      }
      throw error;
    }
  }

  async markAsClosed(slug: string, currentUser: User) {
    try {
      const listing = await this.listingModel
        .findOne({ slug })
        .populate('agent');
      if (listing.agent._id.toString() !== currentUser._id.toString()) {
        throw new ForbiddenException(
          'You are not allowed to perform this action',
        );
      }
      return this.listingModel.findOneAndUpdate(
        { slug },
        { status: ListingStatus.closed },
        { new: true },
      );
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Listing not found');
      }
      throw error;
    }
  }

  async markAsRented(slug: string, currentUser: User) {
    try {
      const listing = await this.listingModel
        .findOne({ slug })
        .populate('agent');
      if (listing.agent._id.toString() !== currentUser._id.toString()) {
        throw new ForbiddenException(
          'You are not allowed to perform this action',
        );
      }

      return this.listingModel.findOneAndUpdate(
        { slug },
        { status: ListingStatus.rented },
        { new: true },
      );
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Listing not found');
      }
      throw error;
    }
  }
}
