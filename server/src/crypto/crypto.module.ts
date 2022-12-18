import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptosController } from './crypto.controller';
import { CryptoGateway } from './crypto.gateway';
import { RateSchema } from './crypto.model';
import { RateService } from './crypto.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rate', schema: RateSchema }])],
  controllers: [CryptosController],
  providers: [CryptoGateway, RateService],
})
export class CryptoModule {}
