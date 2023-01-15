import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateListingDto } from './dtos/create-listing.dto';
import { Listing, ListingStatus } from './schemas/listings.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
  ) {}

  async create(data: CreateListingDto, currentUser: User) {
    console.log(data);
    const createdListing = new this.listingModel({
      ...data,
      agent: currentUser._id,
      status: ListingStatus.active,
    });
    await createdListing.save();
    return createdListing;
  }
}
