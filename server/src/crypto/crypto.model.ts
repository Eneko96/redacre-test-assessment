import * as mongoose from 'mongoose';

export const RateSchema = new mongoose.Schema({
  currency_from: { type: String, required: true },
  amount_1: { type: Number, required: true },
  amount_2: { type: Number, required: true },
  currency_to: { type: String, required: true },
  type: { type: String, required: true },
  consumed_date: { type: Date, required: true },
});

export interface Rate extends mongoose.Document {
  id: string;
  currency_from: string;
  amount_1: number;
  amount_2: number;
  currency_to: string;
  type: string;
  consumed_date: Date;
}

export interface IRate {
  id: string;
  currency_from: string;
  amount_1: number;
  amount_2: number;
  currency_to: string;
  type: string;
  consumed_date: Date;
}
