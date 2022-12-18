import { Body, Controller, Get, Post } from '@nestjs/common';
import { RateService } from './crypto.service';

@Controller('rates')
export class CryptosController {
  constructor(private readonly ratesService: RateService) {}

  // Here we are using the @Get decorator to create a handler for the GET /rates route.
  // The handler will be executed when the client sends a GET request to the /rates route.
  @Get()
  async getRates() {
    return {
      data: await this.ratesService.getRatesFromDb(),
      options: await this.ratesService.getOptions(),
    };
  }

  @Get(':id')
  async getSingleRate(rateId: string) {
    return await this.ratesService.getSinglerate(rateId);
  }

  // Here we are using the @Post decorator to create a handler for the POST /rates route.
  // The handler will be executed when the client sends a POST request to the /rates route.
  // Here will be where the exchanges will be pushed to the database.
  // As you can see either rates and exchanges live within the same collection.
  // the reason for this is the fact that the fields are the same, so we can embed the
  // exchanges int the rates document.
  @Post()
  async pushExchange(
    @Body('currency_from') currency_from: string,
    @Body('currency_to') currency_to: string,
    @Body('amount_1') amount_1: number,
    @Body('amount_2') amount_2: number
  ) {
    return await this.ratesService.pushExchange({
      currency_from,
      currency_to,
      amount_1,
      amount_2,
    });
  }
}
