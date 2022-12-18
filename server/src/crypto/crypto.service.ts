import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IRate, Rate } from './crypto.model';
import fetch from 'node-fetch';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const GECKO =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cripple%2Cdogecoin%2Ccardano&vs_currencies=usd%2Ceur%2Cgbp';
const DEFAULT_RATE_AMOUNT = 1;
const RATE_TYPE = 'Live Rate';
const EXCHANGE_TYPE = 'Exchanged';

@Injectable()
export class RateService {
  private rates: Rate[] = [];
  private readonly logger = new Logger(RateService.name);
  constructor(@InjectModel('Rate') private readonly rateModel: Model<Rate>) {}

  // Get all rates from the database
  // and format them to return the rates to the get request
  // in order to have an easier way to reformat the data
  async getRates() {
    const res = await fetch(GECKO);
    const data = await res.json();
    const rates = [];
    for (const [key, value] of Object.entries(data)) {
      rates.push({
        name: key,
        gbp: (value as any).gbp,
        eur: (value as any).eur,
        usd: (value as any).usd,
      });
    }
    return rates;
  }

  async pushExchange({
    amount_1,
    amount_2,
    currency_from,
    currency_to,
  }: Pick<IRate, 'amount_1' | 'amount_2' | 'currency_from' | 'currency_to'>) {
    const newRate = new this.rateModel({
      currency_from,
      amount_1,
      amount_2,
      currency_to,
      consumed_date: new Date(),
      type: EXCHANGE_TYPE,
    });
    const result = await newRate.save();
    return result.id as string;
  }

  // Here is where we cron the mentioned getRates, where we get the rates from the API
  // and push them to the database. after another format of the data
  // the data is pushed to the database.
  @Cron('0,15,30,45 * * * * *')
  async pushRates() {
    this.logger.debug('called every 15 seconds');
    const rates = await this.getRates();
    const newRate = [];
    for (const rate in rates) {
      const { name, ...rest } = rates[rate];
      for (const key in rest) {
        if (name !== 'name') {
          newRate.push(
            new this.rateModel({
              currency_from: name.charAt(0).toUpperCase() + name.slice(1),
              amount_1: DEFAULT_RATE_AMOUNT,
              amount_2: rest[key],
              currency_to: key,
              consumed_date: new Date(),
              type: RATE_TYPE,
            })
          );
        }
      }
    }
    newRate.forEach(async (rate) =>
      this.rateModel
        .updateOne(
          { currency_from: rate.currency_from, currency_to: rate.currency_to },
          {
            $set: {
              currency_to: rate.currency_to,
              consumed_date: rate.consumed_date,
              amount_2: rate.amount_2,
              amount_1: rate.amount_1,
              type: rate.type,
              currency_from: rate.currency_from,
            },
          },
          { upsert: true }
        )
        .exec()
    );
    return true;
  }

  // Here is where we will have our first call from the client, giving its first data
  // to the client, whilst the socket is initializing
  async getRatesFromDb() {
    const rates = await this.rateModel.find().exec();
    return rates;
  }

  // Here we will extract the set of options of currencies and coins to deliver the options to the client
  async getOptions() {
    const rates = await this.rateModel.find().exec();
    const options = {
      from: [],
      to: [],
    };

    rates.forEach((rate) => {
      if (!options.from.includes(rate.currency_from)) {
        options.from.push(rate.currency_from);
      }
      if (!options.to.includes(rate.currency_to)) {
        options.to.push(rate.currency_to);
      }
    });
    return options;
  }

  // not on use but can be used to get a single rate from the database
  getSinglerate(rateId: string) {
    const rate = this.rates.find((prod) => prod.id === rateId);
    if (!rate) {
      throw new NotFoundException('Could not find rate.');
    }
    return { ...rate };
  }

  // Here we will have our change stream, which will be listening to the database
  // for any changes, and will emit the changes to the client
  async hearCollection(client) {
    // watch collection for changes
    const pipeline = [
      {
        $match: {
          $or: [
            { 'fullDocument.type': 'Live Rate' },
            { 'fullDocument.type': 'Exchanged' },
          ],
        },
      },
    ];
    const options = { fullDocument: 'updateLookup' };
    const changeStream = this.rateModel.watch(pipeline, options);
    changeStream.on('change', (change) => {
      this.logger.debug('@Change Stream');
      client.emit('change-rates', { evt: 'change', data: change });
    });
  }
}
