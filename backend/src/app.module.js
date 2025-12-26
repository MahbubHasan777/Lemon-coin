'use strict';
const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { BlockchainModule } = require('./blockchain');
const {
  BlocksController,
  TransactionsController,
  AddressesController,
  MiningController,
  StatsController
} = require('./controllers');

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain-explorer'),
    BlockchainModule
  ],
  controllers: [
    BlocksController,
    TransactionsController,
    AddressesController,
    MiningController,
    StatsController
  ],
})
class AppModule { }

module.exports = { AppModule };
