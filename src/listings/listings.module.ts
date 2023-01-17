import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { Listing, ListingSchema } from './schemas/listings.schema';
import slugify from 'slugify';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Listing.name,
        useFactory: () => {
          const schema = ListingSchema;
          schema.pre('save', function (next) {
            const slug_tail = Math.floor(Math.random() * 10000);
            this.slug = `${slugify(this.title, {
              lower: true,
              strict: true,
            })}-${slug_tail}`;
            next();
          });
          schema.index({
            title: 'text',
            description: 'text',
            'location.address': 'text',
            'location.city': 'text',
            'location.state': 'text',
            'location.country': 'text',
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
