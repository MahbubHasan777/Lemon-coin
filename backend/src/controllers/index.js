'use strict';
const { BlocksController } = require('./blocks.controller');
const { TransactionsController } = require('./transactions.controller');
const { AddressesController } = require('./addresses.controller');
const { MiningController } = require('./mining.controller');
const { StatsController } = require('./stats.controller');

module.exports = {
    BlocksController,
    TransactionsController,
    AddressesController,
    MiningController,
    StatsController
};
