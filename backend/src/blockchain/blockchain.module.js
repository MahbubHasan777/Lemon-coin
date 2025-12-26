'use strict';
const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { BlockchainService } = require('./blockchain.service');
const { BlockSchema, TransactionSchema, WalletSchema } = require('./schemas');

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Block', schema: BlockSchema },
            { name: 'Transaction', schema: TransactionSchema },
            { name: 'Wallet', schema: WalletSchema }
        ])
    ],
    providers: [BlockchainService],
    exports: [BlockchainService]
})
class BlockchainModule { }

module.exports = { BlockchainModule };
