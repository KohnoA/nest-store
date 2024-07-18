import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';
import { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import QueryHandler from 'src/utils/QueryHandler';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(
    query: ExpressQuery,
  ): Promise<{ products: Product[]; total: number }> {
    const queryOptions = new QueryHandler(query);
    const filters = queryOptions.filter();
    const sort = queryOptions.sort();
    const { limit, skip } = queryOptions.pagination();

    const total = await this.productModel.countDocuments(filters);
    const products = await this.productModel
      .find(filters)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec();

    return {
      products,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.productModel.findOne({ id }).exec();

    if (!product) {
      throw new HttpException('Product Not Found', 404);
    }

    return product;
  }
}
