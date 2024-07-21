import { HttpException } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';

export default class QueryHandler {
  constructor(private query: ExpressQuery) {}

  filter() {
    const { search, category, brand } = this.query;

    const filters = {
      ...(search
        ? {
            title: {
              $regex: search,
              $options: 'i',
            },
          }
        : {}),
      ...(category
        ? {
            category: {
              $regex: category,
              $options: 'i',
            },
          }
        : {}),
      ...(brand
        ? {
            brand: {
              $regex: brand,
              $options: 'i',
            },
          }
        : {}),
    };

    return filters;
  }

  sort() {
    const SORT_OPTIONS = {
      priceASC: {
        price: -1,
      },
      priceDESC: {
        price: 1,
      },
      ratingASC: {
        rating: -1,
      },
      ratingDESC: {
        rating: 1,
      },
      dicountASC: {
        discountPercentage: -1,
      },
      discountDESC: {
        discountPercentage: 1,
      },
    };
    const sortOption = SORT_OPTIONS[String(this.query.sort)];

    if (this.query.sort && !sortOption) {
      throw new HttpException('Incorrect sort option', 400);
    }

    return sortOption;
  }

  pagination(defaultLimit = 20) {
    const limit = Number(this.query.limit) || defaultLimit;
    const page = Number(this.query.page) || 1;
    const skip = limit * (page - 1);

    return { limit, skip };
  }
}
